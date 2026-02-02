import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RecipeService } from './recipe.service';
import { RecommendationService } from './recommendation.service';
import { RecipeFilterDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipeController {
  constructor(
    private recipeService: RecipeService,
    private recommendationService: RecommendationService,
  ) {}

  @Get()
  @ApiOperation({ summary: '레시피 목록' })
  async findAll(@Query() filter: RecipeFilterDto) {
    const result = await this.recipeService.findAll(filter);
    return { success: true, data: result };
  }

  @Get('recommended')
  @ApiOperation({ summary: '맞춤 레시피 추천' })
  async getRecommended(@GetUser('id') userId: string) {
    const recipes = await this.recommendationService.getRecommendations(userId);
    return { success: true, data: { items: recipes } };
  }

  @Get(':id')
  @ApiOperation({ summary: '레시피 상세' })
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipeService.findById(id);
    return { success: true, data: recipe };
  }

  @Get(':id/customized')
  @ApiOperation({ summary: '맞춤형 레시피 (대체 재료 적용)' })
  async getCustomized(@GetUser('id') userId: string, @Param('id') id: string) {
    const recipe = await this.recipeService.getCustomized(id, userId);
    return { success: true, data: recipe };
  }
}
