import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FamilyModule } from './modules/family/family.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { MealModule } from './modules/meal/meal.module';
import { CommunityModule } from './modules/community/community.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Scheduling for notifications
    ScheduleModule.forRoot(),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UserModule,
    FamilyModule,
    InventoryModule,
    RecipeModule,
    MealModule,
    CommunityModule,
    NotificationModule,
  ],
})
export class AppModule {}
