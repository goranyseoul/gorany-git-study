import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecommendationService } from './recommendation.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [RecipeController],
  providers: [RecipeService, RecommendationService],
  exports: [RecipeService],
})
export class RecipeModule {}
