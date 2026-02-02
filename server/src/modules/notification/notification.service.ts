import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return {
      items: notifications,
      unreadCount,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data,
      },
    });

    // In real implementation, send push notification via Firebase
    // await this.sendPushNotification(userId, title, body, data);

    return notification;
  }

  async createExpiryWarning(userId: string, itemName: string, daysLeft: number) {
    return this.createNotification(
      userId,
      'expiry_warning',
      '유통기한 임박',
      `${itemName}의 유통기한이 ${daysLeft}일 남았습니다.`,
      { type: 'expiry_warning', itemName, daysLeft },
    );
  }

  async createRecipeRecommendation(userId: string, recipeName: string, recipeId: string) {
    return this.createNotification(
      userId,
      'recipe_recommend',
      '오늘의 추천 레시피',
      `${recipeName}를 만들어 보세요!`,
      { type: 'recipe_recommend', recipeId },
    );
  }

  // Private method to send push notification (to be implemented with Firebase)
  // private async sendPushNotification(
  //   userId: string,
  //   title: string,
  //   body: string,
  //   data?: any,
  // ) {
  //   // Get user's FCM token from database
  //   // Send via Firebase Admin SDK
  // }
}
