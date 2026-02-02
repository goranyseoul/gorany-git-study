import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '알림 목록' })
  async getNotifications(@GetUser('id') userId: string) {
    const result = await this.notificationService.getNotifications(userId);
    return { success: true, data: result };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리' })
  async markAsRead(
    @GetUser('id') userId: string,
    @Param('id') notificationId: string,
  ) {
    await this.notificationService.markAsRead(userId, notificationId);
    return { success: true };
  }

  @Patch('read-all')
  @ApiOperation({ summary: '전체 읽음 처리' })
  async markAllAsRead(@GetUser('id') userId: string) {
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }
}
