import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // Run every day at 9:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiryDates() {
    console.log('Checking expiry dates...');

    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find items expiring within 7 days
    const expiringItems = await this.prisma.inventoryItem.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: sevenDaysLater,
        },
      },
      include: {
        user: { select: { id: true } },
        family: {
          include: {
            members: { select: { userId: true } },
          },
        },
      },
    });

    for (const item of expiringItems) {
      const daysLeft = Math.ceil(
        (item.expiryDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Determine who to notify
      const userIds = new Set<string>();
      userIds.add(item.userId);
      if (item.family) {
        item.family.members.forEach((m) => userIds.add(m.userId));
      }

      // Create notification for each user
      for (const userId of userIds) {
        // Check if notification already sent today
        const existingNotification = await this.prisma.notification.findFirst({
          where: {
            userId,
            type: 'expiry_warning',
            createdAt: {
              gte: new Date(now.setHours(0, 0, 0, 0)),
            },
            data: {
              path: ['itemName'],
              equals: item.name,
            },
          },
        });

        if (!existingNotification) {
          await this.notificationService.createExpiryWarning(
            userId,
            item.name,
            daysLeft,
          );
        }
      }
    }

    console.log(`Processed ${expiringItems.length} expiring items`);
  }

  // Run every day at 11:00 AM - Recipe recommendations
  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async sendRecipeRecommendations() {
    console.log('Sending recipe recommendations...');

    // Get active users who haven't received a recommendation today
    const users = await this.prisma.user.findMany({
      where: {
        notifications: {
          none: {
            type: 'recipe_recommend',
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
      include: {
        preference: true,
      },
      take: 100, // Limit batch size
    });

    for (const user of users) {
      // Get a random recipe matching user's preferences
      const recipes = await this.prisma.recipe.findMany({
        where: user.preference?.dietTypes?.length
          ? { dietTypes: { hasSome: user.preference.dietTypes } }
          : {},
        take: 10,
      });

      if (recipes.length > 0) {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        await this.notificationService.createRecipeRecommendation(
          user.id,
          randomRecipe.title,
          randomRecipe.id,
        );
      }
    }

    console.log(`Sent recommendations to ${users.length} users`);
  }
}
