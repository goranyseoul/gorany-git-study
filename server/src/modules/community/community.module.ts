import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { ShortsController } from './shorts.controller';
import { CommunityService } from './community.service';

@Module({
  controllers: [PostController, ShortsController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
