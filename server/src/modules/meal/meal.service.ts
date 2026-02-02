import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMealDto, MealFeedbackDto, MealFilterDto } from './dto';

@Injectable()
export class MealService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filter: MealFilterDto) {
    const where: any = { userId };

    if (filter.date) {
      const date = new Date(filter.date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      where.mealTime = {
        gte: date,
        lt: nextDate,
      };
    } else if (filter.startDate && filter.endDate) {
      where.mealTime = {
        gte: new Date(filter.startDate),
        lte: new Date(filter.endDate),
      };
    }

    if (filter.type) {
      where.type = filter.type;
    }

    const meals = await this.prisma.meal.findMany({
      where,
      orderBy: { mealTime: 'desc' },
      include: {
        recipe: {
          select: { id: true, title: true, imageUrl: true },
        },
        feedback: true,
      },
    });

    return meals;
  }

  async create(userId: string, dto: CreateMealDto) {
    return this.prisma.meal.create({
      data: {
        userId,
        type: dto.type,
        imageUrl: dto.imageUrl,
        recipeId: dto.recipeId,
        mealTime: new Date(dto.mealTime),
        memo: dto.memo,
      },
      include: {
        recipe: {
          select: { id: true, title: true, imageUrl: true },
        },
      },
    });
  }

  async analyzeMeal(id: string) {
    const meal = await this.prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      throw new NotFoundException('식사 기록을 찾을 수 없습니다');
    }

    // In real implementation, call AI service (Google Vision) to analyze the image
    // For now, return mock data
    const mockAnalysis = {
      foods: [
        { name: '흰쌀밥', portion: '1공기', calories: 300 },
        { name: '된장찌개', portion: '1그릇', calories: 120 },
        { name: '김치', portion: '1접시', calories: 30 },
      ],
      totalNutrition: {
        calories: 450,
        protein: 15,
        carbs: 75,
        fat: 8,
      },
    };

    // Update meal with analyzed nutrition
    await this.prisma.meal.update({
      where: { id },
      data: { nutrition: mockAnalysis.totalNutrition },
    });

    return mockAnalysis;
  }

  async addFeedback(userId: string, mealId: string, dto: MealFeedbackDto) {
    // Verify ownership
    const meal = await this.prisma.meal.findFirst({
      where: { id: mealId, userId },
    });

    if (!meal) {
      throw new NotFoundException('식사 기록을 찾을 수 없습니다');
    }

    return this.prisma.mealFeedback.upsert({
      where: { mealId },
      update: {
        tasteRating: dto.tasteRating,
        portionFeedback: dto.portionFeedback,
        comment: dto.comment,
      },
      create: {
        mealId,
        tasteRating: dto.tasteRating,
        portionFeedback: dto.portionFeedback,
        comment: dto.comment,
      },
    });
  }

  async getStats(userId: string, period: 'week' | 'month') {
    const now = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const meals = await this.prisma.meal.findMany({
      where: {
        userId,
        mealTime: {
          gte: startDate,
          lte: now,
        },
      },
    });

    // Calculate statistics
    const totalCalories = meals.reduce((sum, meal) => {
      const nutrition = meal.nutrition as any;
      return sum + (nutrition?.calories || 0);
    }, 0);

    const avgCaloriesPerDay = totalCalories / (period === 'week' ? 7 : 30);

    const mealCounts = {
      breakfast: meals.filter((m) => m.type === 'breakfast').length,
      lunch: meals.filter((m) => m.type === 'lunch').length,
      dinner: meals.filter((m) => m.type === 'dinner').length,
      snack: meals.filter((m) => m.type === 'snack').length,
    };

    return {
      period,
      totalMeals: meals.length,
      totalCalories,
      avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
      mealCounts,
    };
  }
}
