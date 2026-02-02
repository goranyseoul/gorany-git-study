import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RecipeFilterDto } from './dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: RecipeFilterDto) {
    const where: any = {};

    if (filter.q) {
      where.OR = [
        { title: { contains: filter.q, mode: 'insensitive' } },
        { tags: { has: filter.q } },
      ];
    }

    if (filter.dietType) {
      where.dietTypes = { has: filter.dietType };
    }

    if (filter.difficulty) {
      where.difficulty = filter.difficulty;
    }

    if (filter.maxTime) {
      where.cookingTime = { lte: filter.maxTime };
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      take: filter.limit || 20,
      skip: ((filter.page || 1) - 1) * (filter.limit || 20),
      orderBy: { createdAt: 'desc' },
      include: {
        ingredients: true,
      },
    });

    const total = await this.prisma.recipe.count({ where });

    return {
      items: recipes,
      meta: {
        total,
        page: filter.page || 1,
        limit: filter.limit || 20,
        totalPages: Math.ceil(total / (filter.limit || 20)),
      },
    };
  }

  async findById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            substitutes: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('레시피를 찾을 수 없습니다');
    }

    // Increment view count
    await this.prisma.recipe.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return recipe;
  }

  async getCustomized(id: string, userId: string) {
    const recipe = await this.findById(id);

    // Get user preference
    const preference = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preference?.dietTypes?.length) {
      return recipe;
    }

    // Get user inventory
    const inventory = await this.prisma.inventoryItem.findMany({
      where: {
        OR: [{ userId }, { family: { members: { some: { userId } } } }],
      },
    });

    const inventoryNames = inventory.map((item) => item.name.toLowerCase());

    // Customize ingredients with substitutes based on diet type
    const customizedIngredients = recipe.ingredients.map((ingredient) => {
      // Check if ingredient is in inventory
      const inInventory = inventoryNames.some(
        (name) =>
          name.includes(ingredient.name.toLowerCase()) ||
          ingredient.name.toLowerCase().includes(name),
      );

      // Find applicable substitute based on user's diet types
      const applicableSubstitute = ingredient.substitutes.find((sub) =>
        preference.dietTypes.some((diet) =>
          sub.reason.toLowerCase().includes(diet.toLowerCase()),
        ),
      );

      return {
        ...ingredient,
        inInventory,
        substitute: applicableSubstitute || null,
      };
    });

    // Calculate customized nutrition if substitutes are applied
    let customizedNutrition = recipe.nutrition as any;
    for (const ingredient of customizedIngredients) {
      if (ingredient.substitute?.nutritionDiff) {
        const diff = ingredient.substitute.nutritionDiff as any;
        customizedNutrition = {
          calories: (customizedNutrition?.calories || 0) + (diff.calories || 0),
          protein: (customizedNutrition?.protein || 0) + (diff.protein || 0),
          carbs: (customizedNutrition?.carbs || 0) + (diff.carbs || 0),
          fat: (customizedNutrition?.fat || 0) + (diff.fat || 0),
        };
      }
    }

    return {
      ...recipe,
      ingredients: customizedIngredients,
      originalNutrition: recipe.nutrition,
      customizedNutrition,
    };
  }

  /**
   * 요리 완료 처리 - 재고 차감
   * BUG-001 수정: 단위 변환 로직 추가
   */
  async completeCooking(recipeId: string, userId: string, servings: number = 1) {
    const recipe = await this.findById(recipeId);

    // Get user inventory
    const inventory = await this.prisma.inventoryItem.findMany({
      where: {
        OR: [{ userId }, { family: { members: { some: { userId } } } }],
      },
    });

    const deductedItems: Array<{
      inventoryId: string;
      name: string;
      deducted: number;
      unit: string;
      skipped: boolean;
      reason?: string;
    }> = [];

    // Process each ingredient
    for (const ingredient of recipe.ingredients) {
      // Find matching inventory item
      const inventoryItem = inventory.find(
        (item) =>
          item.name.toLowerCase() === ingredient.name.toLowerCase() ||
          item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
          ingredient.name.toLowerCase().includes(item.name.toLowerCase()),
      );

      if (!inventoryItem) {
        deductedItems.push({
          inventoryId: '',
          name: ingredient.name,
          deducted: 0,
          unit: ingredient.unit,
          skipped: true,
          reason: '재고에 없음',
        });
        continue;
      }

      // 단위 변환 시도
      const conversionResult = this.convertUnit(
        ingredient.amount * servings,
        ingredient.unit,
        inventoryItem.unit,
      );

      if (!conversionResult.success) {
        // 단위 변환 불가능 - 스킵하고 기록
        deductedItems.push({
          inventoryId: inventoryItem.id,
          name: ingredient.name,
          deducted: 0,
          unit: inventoryItem.unit,
          skipped: true,
          reason: `단위 변환 불가 (${ingredient.unit} → ${inventoryItem.unit})`,
        });
        continue;
      }

      const amountToDeduct = conversionResult.amount;

      // 재고보다 많이 필요하면 있는 만큼만 차감
      const actualDeduction = Math.min(amountToDeduct, inventoryItem.quantity);
      const newQuantity = inventoryItem.quantity - actualDeduction;

      if (newQuantity <= 0) {
        // 재고 삭제
        await this.prisma.inventoryItem.delete({
          where: { id: inventoryItem.id },
        });
      } else {
        // 수량 업데이트
        await this.prisma.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: { quantity: newQuantity },
        });
      }

      deductedItems.push({
        inventoryId: inventoryItem.id,
        name: ingredient.name,
        deducted: actualDeduction,
        unit: inventoryItem.unit,
        skipped: false,
      });
    }

    // 식사 기록 생성
    const mealRecord = await this.prisma.mealRecord.create({
      data: {
        userId,
        recipeId,
        servings,
        type: 'recipe',
        consumedAt: new Date(),
      },
    });

    return {
      success: true,
      mealRecordId: mealRecord.id,
      deductedItems,
      skippedCount: deductedItems.filter((item) => item.skipped).length,
    };
  }

  /**
   * 단위 변환 헬퍼
   * 같은 타입의 단위끼리만 변환 가능
   */
  private convertUnit(
    amount: number,
    fromUnit: string,
    toUnit: string,
  ): { success: boolean; amount: number } {
    // 같은 단위면 그대로 반환
    if (fromUnit === toUnit) {
      return { success: true, amount };
    }

    // 단위 변환 맵 (기준: 기본 단위)
    const unitGroups: Record<string, Record<string, number>> = {
      // 무게 (기준: g)
      weight: {
        g: 1,
        kg: 1000,
        mg: 0.001,
      },
      // 부피 (기준: ml)
      volume: {
        ml: 1,
        l: 1000,
        L: 1000,
        cc: 1,
      },
      // 개수 (변환 불가)
      count: {
        개: 1,
        알: 1,
        조각: 1,
        쪽: 1,
        장: 1,
        모: 1,
        팩: 1,
        병: 1,
        캔: 1,
        봉: 1,
      },
      // 스푼 (기준: 작은술)
      spoon: {
        작은술: 1,
        큰술: 3,
        ts: 1,
        Ts: 3,
        tsp: 1,
        tbsp: 3,
      },
      // 컵 (기준: ml, 1컵 = 200ml)
      cup: {
        컵: 200,
      },
    };

    // 단위가 속한 그룹 찾기
    let fromGroup: string | null = null;
    let toGroup: string | null = null;

    for (const [group, units] of Object.entries(unitGroups)) {
      if (fromUnit in units) fromGroup = group;
      if (toUnit in units) toGroup = group;
    }

    // 같은 그룹이 아니면 변환 불가
    if (!fromGroup || !toGroup || fromGroup !== toGroup) {
      // 개수 단위끼리는 1:1로 취급 (근사값)
      if (fromGroup === 'count' && toGroup === 'count') {
        return { success: true, amount };
      }
      return { success: false, amount: 0 };
    }

    // 변환 계산
    const fromBase = unitGroups[fromGroup][fromUnit];
    const toBase = unitGroups[toGroup][toUnit];
    const convertedAmount = (amount * fromBase) / toBase;

    return { success: true, amount: Math.round(convertedAmount * 100) / 100 };
  }
}
