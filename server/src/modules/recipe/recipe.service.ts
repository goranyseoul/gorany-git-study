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
}
