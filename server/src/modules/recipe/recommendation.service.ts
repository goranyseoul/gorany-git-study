import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface RecommendedRecipe {
  id: string;
  title: string;
  imageUrl: string | null;
  cookingTime: number | null;
  difficulty: string | null;
  matchRate: number;
  dietBadges: string[];
  missingIngredients: string[];
}

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async getRecommendations(userId: string): Promise<RecommendedRecipe[]> {
    // Get user preference
    const preference = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    // Get user inventory
    const inventory = await this.prisma.inventoryItem.findMany({
      where: {
        OR: [{ userId }, { family: { members: { some: { userId } } } }],
      },
    });

    const inventoryNames = inventory.map((item) => item.name.toLowerCase());

    // Get recipes that match user's diet types
    const recipes = await this.prisma.recipe.findMany({
      where: preference?.dietTypes?.length
        ? { dietTypes: { hasSome: preference.dietTypes } }
        : {},
      include: {
        ingredients: true,
      },
      take: 50,
    });

    // Calculate match rate for each recipe
    const recommendedRecipes: RecommendedRecipe[] = recipes.map((recipe) => {
      const totalIngredients = recipe.ingredients.filter((i) => i.isRequired).length;
      const matchedIngredients = recipe.ingredients.filter(
        (ingredient) =>
          ingredient.isRequired &&
          inventoryNames.some(
            (name) =>
              name.includes(ingredient.name.toLowerCase()) ||
              ingredient.name.toLowerCase().includes(name),
          ),
      ).length;

      const missingIngredients = recipe.ingredients
        .filter(
          (ingredient) =>
            ingredient.isRequired &&
            !inventoryNames.some(
              (name) =>
                name.includes(ingredient.name.toLowerCase()) ||
                ingredient.name.toLowerCase().includes(name),
            ),
        )
        .map((i) => i.name);

      const matchRate =
        totalIngredients > 0
          ? Math.round((matchedIngredients / totalIngredients) * 100)
          : 0;

      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        matchRate,
        dietBadges: recipe.dietTypes,
        missingIngredients,
      };
    });

    // Sort by match rate (descending)
    recommendedRecipes.sort((a, b) => b.matchRate - a.matchRate);

    return recommendedRecipes.slice(0, 20);
  }
}
