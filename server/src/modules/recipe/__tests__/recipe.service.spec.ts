import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from '../recipe.service';
import { RecommendationService } from '../recommendation.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrismaService = {
  recipe: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  inventoryItem: {
    findMany: jest.fn(),
  },
  userPreference: {
    findUnique: jest.fn(),
  },
  mealRecord: {
    create: jest.fn(),
  },
};

describe('RecipeService', () => {
  let service: RecipeService;
  let recommendationService: RecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        RecommendationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recommendationService = module.get<RecommendationService>(RecommendationService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    // TC-RECIPE-001: 레시피 목록 조회
    it('should return list of recipes', async () => {
      const mockRecipes = [
        { id: 'recipe-1', title: '김치찌개', cookingTime: 30 },
        { id: 'recipe-2', title: '된장찌개', cookingTime: 25 },
      ];

      mockPrismaService.recipe.findMany.mockResolvedValue(mockRecipes);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });

    // TC-RECIPE-003: 식단 맞춤 레시피 필터
    it('should filter recipes by diet type', async () => {
      const dietType = 'diabetes';
      const mockRecipes = [
        { id: 'recipe-1', title: '당뇨식 샐러드', dietTypes: ['diabetes'] },
      ];

      mockPrismaService.recipe.findMany.mockResolvedValue(mockRecipes);

      const result = await service.findAll({ dietType });

      expect(mockPrismaService.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            dietTypes: { has: dietType },
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    // TC-RECIPE-006: 레시피 상세 조회
    it('should return recipe with ingredients and steps', async () => {
      const recipeId = 'recipe-1';
      const mockRecipe = {
        id: recipeId,
        title: '김치찌개',
        ingredients: [
          { name: '김치', amount: 200, unit: 'g' },
          { name: '돼지고기', amount: 150, unit: 'g' },
        ],
        steps: [
          { order: 1, description: '재료 준비' },
          { order: 2, description: '끓이기' },
        ],
        nutrition: {
          calories: 350,
          protein: 20,
          carbs: 15,
          fat: 18,
        },
      };

      mockPrismaService.recipe.findUnique.mockResolvedValue(mockRecipe);

      const result = await service.findById(recipeId);

      expect(result).toHaveProperty('ingredients');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('nutrition');
    });
  });

  describe('getRecommended', () => {
    // TC-RECIPE-002: 재고 기반 레시피 추천
    it('should recommend recipes based on inventory', async () => {
      const userId = 'user-1';

      // Mock user inventory
      mockPrismaService.inventoryItem.findMany.mockResolvedValue([
        { name: '김치', quantity: 500, unit: 'g' },
        { name: '돼지고기', quantity: 300, unit: 'g' },
        { name: '두부', quantity: 1, unit: '모' },
      ]);

      // Mock recipes
      mockPrismaService.recipe.findMany.mockResolvedValue([
        {
          id: 'recipe-1',
          title: '김치찌개',
          ingredients: [
            { name: '김치', amount: 200, unit: 'g' },
            { name: '돼지고기', amount: 150, unit: 'g' },
          ],
        },
        {
          id: 'recipe-2',
          title: '마파두부',
          ingredients: [
            { name: '두부', amount: 1, unit: '모' },
            { name: '다진고기', amount: 100, unit: 'g' },
          ],
        },
      ]);

      const result = await service.getRecommended(userId);

      // 김치찌개 should have higher match rate (100%) than 마파두부 (50%)
      expect(result[0].title).toBe('김치찌개');
      expect(result[0].matchRate).toBeGreaterThan(result[1].matchRate);
    });
  });

  describe('getCustomized', () => {
    // TC-RECIPE-004: 대체 재료 표시
    it('should suggest substitute ingredients for dietary restrictions', async () => {
      const recipeId = 'recipe-1';
      const userId = 'user-1';

      // User has diabetes diet preference
      mockPrismaService.userPreference.findUnique.mockResolvedValue({
        userId,
        dietTypes: ['diabetes'],
      });

      mockPrismaService.recipe.findUnique.mockResolvedValue({
        id: recipeId,
        title: '달콤한 팬케이크',
        ingredients: [
          { name: '설탕', amount: 50, unit: 'g' },
          { name: '밀가루', amount: 200, unit: 'g' },
        ],
      });

      const result = await service.getCustomized(recipeId, userId);

      // Should suggest allulose instead of sugar for diabetes
      const sugarIngredient = result.ingredients.find(i => i.name === '설탕');
      expect(sugarIngredient).toHaveProperty('substitute');
      expect(sugarIngredient.substitute.name).toBe('알룰로스');
    });

    // TC-RECIPE-005: 영양소 비교
    it('should compare nutrition between original and customized', async () => {
      const recipeId = 'recipe-1';
      const userId = 'user-1';

      mockPrismaService.userPreference.findUnique.mockResolvedValue({
        userId,
        dietTypes: ['diabetes'],
      });

      mockPrismaService.recipe.findUnique.mockResolvedValue({
        id: recipeId,
        title: '달콤한 팬케이크',
        ingredients: [{ name: '설탕', amount: 50, unit: 'g' }],
        nutrition: { calories: 400, carbs: 60 },
      });

      const result = await service.getCustomized(recipeId, userId);

      expect(result).toHaveProperty('originalNutrition');
      expect(result).toHaveProperty('customizedNutrition');
      // Customized should have lower carbs (allulose has fewer carbs than sugar)
      expect(result.customizedNutrition.carbs).toBeLessThan(
        result.originalNutrition.carbs,
      );
    });
  });

  describe('completeCooking', () => {
    // TC-RECIPE-007: 요리 시작 → 재고 차감
    it('should deduct inventory after cooking', async () => {
      const recipeId = 'recipe-1';
      const userId = 'user-1';

      mockPrismaService.recipe.findUnique.mockResolvedValue({
        id: recipeId,
        ingredients: [
          { name: '김치', amount: 200, unit: 'g' },
          { name: '돼지고기', amount: 150, unit: 'g' },
        ],
      });

      mockPrismaService.inventoryItem.findMany.mockResolvedValue([
        { id: 'inv-1', name: '김치', quantity: 500, unit: 'g' },
        { id: 'inv-2', name: '돼지고기', quantity: 300, unit: 'g' },
      ]);

      const result = await service.completeCooking(recipeId, userId);

      expect(result).toHaveProperty('deductedItems');
      expect(result.deductedItems).toHaveLength(2);
    });
  });
});
