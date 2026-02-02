import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(private communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: '라운지 게시글 목록' })
  async getPosts(
    @Query('sort') sort: 'latest' | 'popular' = 'latest',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.communityService.getPosts(sort, page, limit);
    return { success: true, data: result };
  }

  @Post()
  @ApiOperation({ summary: '게시글 작성' })
  async createPost(@GetUser('id') userId: string, @Body() dto: CreatePostDto) {
    const post = await this.communityService.createPost(userId, dto);
    return { success: true, data: post };
  }

  @Post(':id/like')
  @ApiOperation({ summary: '게시글 좋아요' })
  async likePost(@GetUser('id') userId: string, @Param('id') postId: string) {
    const result = await this.communityService.likePost(userId, postId);
    return { success: true, data: result };
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '댓글 목록' })
  async getComments(@Param('id') postId: string) {
    const comments = await this.communityService.getComments(postId);
    return { success: true, data: comments };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: '댓글 작성' })
  async createComment(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.communityService.createComment(
      userId,
      dto,
      postId,
    );
    return { success: true, data: comment };
  }
}
