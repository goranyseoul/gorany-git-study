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
import { CommunityService } from './community.service';
import { CreateShortsDto, CreateCommentDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Shorts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('shorts')
export class ShortsController {
  constructor(private communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: '쇼츠 목록' })
  async getShorts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.communityService.getShorts(page, limit);
    return { success: true, data: result };
  }

  @Post()
  @ApiOperation({ summary: '쇼츠 업로드' })
  async createShorts(
    @GetUser('id') userId: string,
    @Body() dto: CreateShortsDto,
  ) {
    const shorts = await this.communityService.createShorts(userId, dto);
    return { success: true, data: shorts };
  }

  @Post(':id/like')
  @ApiOperation({ summary: '쇼츠 좋아요' })
  async likeShorts(
    @GetUser('id') userId: string,
    @Param('id') shortsId: string,
  ) {
    const result = await this.communityService.likeShorts(userId, shortsId);
    return { success: true, data: result };
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '쇼츠 댓글 목록' })
  async getComments(@Param('id') shortsId: string) {
    const comments = await this.communityService.getComments(undefined, shortsId);
    return { success: true, data: comments };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: '쇼츠 댓글 작성' })
  async createComment(
    @GetUser('id') userId: string,
    @Param('id') shortsId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.communityService.createComment(
      userId,
      dto,
      undefined,
      shortsId,
    );
    return { success: true, data: comment };
  }
}
