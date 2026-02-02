import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MealService } from './meal.service';
import { CreateMealDto, MealFeedbackDto, MealFilterDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Meals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @Get()
  @ApiOperation({ summary: '식사 기록 목록' })
  async findAll(@GetUser('id') userId: string, @Query() filter: MealFilterDto) {
    const meals = await this.mealService.findAll(userId, filter);
    return { success: true, data: meals };
  }

  @Post()
  @ApiOperation({ summary: '식사 기록 추가' })
  async create(@GetUser('id') userId: string, @Body() dto: CreateMealDto) {
    const meal = await this.mealService.create(userId, dto);
    return { success: true, data: meal };
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: '음식 사진 AI 분석' })
  async analyze(@Param('id') id: string) {
    const analysis = await this.mealService.analyzeMeal(id);
    return { success: true, data: analysis };
  }

  @Post(':id/feedback')
  @ApiOperation({ summary: '식사 피드백 등록' })
  async addFeedback(
    @GetUser('id') userId: string,
    @Param('id') mealId: string,
    @Body() dto: MealFeedbackDto,
  ) {
    const feedback = await this.mealService.addFeedback(userId, mealId, dto);
    return { success: true, data: feedback };
  }

  @Get('stats')
  @ApiOperation({ summary: '식사 통계' })
  async getStats(
    @GetUser('id') userId: string,
    @Query('period') period: 'week' | 'month' = 'week',
  ) {
    const stats = await this.mealService.getStats(userId, period);
    return { success: true, data: stats };
  }
}
