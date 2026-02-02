import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, CreateShortsDto, CreateCommentDto } from './dto';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  // ==================== Posts ====================

  async getPosts(sort: 'latest' | 'popular', page: number, limit: number) {
    const posts = await this.prisma.post.findMany({
      orderBy: sort === 'latest' ? { createdAt: 'desc' } : { likeCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
        recipe: {
          select: { id: true, title: true },
        },
      },
    });

    const total = await this.prisma.post.count();

    return {
      items: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        content: dto.content,
        imageUrls: dto.imageUrls || [],
        recipeId: dto.recipeId,
      },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
      },
    });
  }

  async likePost(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: { userId, postId },
      });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  // ==================== Shorts ====================

  async getShorts(page: number, limit: number) {
    const shorts = await this.prisma.shorts.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
        recipe: {
          select: { id: true, title: true },
        },
      },
    });

    const total = await this.prisma.shorts.count();

    return {
      items: shorts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createShorts(userId: string, dto: CreateShortsDto) {
    return this.prisma.shorts.create({
      data: {
        userId,
        title: dto.title,
        videoUrl: dto.videoUrl,
        thumbnailUrl: dto.thumbnailUrl,
        recipeId: dto.recipeId,
      },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
      },
    });
  }

  async likeShorts(userId: string, shortsId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { userId_shortsId: { userId, shortsId } },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      await this.prisma.shorts.update({
        where: { id: shortsId },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, shortsId },
      });
      await this.prisma.shorts.update({
        where: { id: shortsId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  // ==================== Comments ====================

  async getComments(postId?: string, shortsId?: string) {
    const where: any = {};
    if (postId) where.postId = postId;
    if (shortsId) where.shortsId = shortsId;

    return this.prisma.comment.findMany({
      where: { ...where, parentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, profileImage: true, isSupporter: true },
            },
          },
        },
      },
    });
  }

  async createComment(
    userId: string,
    dto: CreateCommentDto,
    postId?: string,
    shortsId?: string,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        userId,
        content: dto.content,
        postId,
        shortsId,
        parentId: dto.parentId,
      },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true, isSupporter: true },
        },
      },
    });

    // Update comment count
    if (postId) {
      await this.prisma.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      });
    }
    if (shortsId) {
      await this.prisma.shorts.update({
        where: { id: shortsId },
        data: { commentCount: { increment: 1 } },
      });
    }

    return comment;
  }
}
