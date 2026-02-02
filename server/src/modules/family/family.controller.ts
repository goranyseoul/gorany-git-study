import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FamilyService } from './family.service';
import { CreateFamilyDto, JoinFamilyDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Family')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('families')
export class FamilyController {
  constructor(private familyService: FamilyService) {}

  @Post()
  @ApiOperation({ summary: '가족 그룹 생성' })
  async create(@GetUser('id') userId: string, @Body() dto: CreateFamilyDto) {
    const family = await this.familyService.create(userId, dto.name);
    return { success: true, data: family };
  }

  @Post('join')
  @ApiOperation({ summary: '가족 그룹 참여' })
  async join(@GetUser('id') userId: string, @Body() dto: JoinFamilyDto) {
    const family = await this.familyService.join(userId, dto.inviteCode);
    return { success: true, data: family };
  }

  @Get('me')
  @ApiOperation({ summary: '내 가족 그룹 조회' })
  async getMyFamily(@GetUser('id') userId: string) {
    const family = await this.familyService.findByUserId(userId);
    return { success: true, data: family };
  }

  @Get(':id')
  @ApiOperation({ summary: '가족 그룹 상세 조회' })
  async getFamily(@Param('id') id: string) {
    const family = await this.familyService.findById(id);
    return { success: true, data: family };
  }

  @Get(':id/members')
  @ApiOperation({ summary: '가족 구성원 목록' })
  async getMembers(@Param('id') id: string) {
    const members = await this.familyService.getMembers(id);
    return { success: true, data: members };
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: '가족 구성원 삭제' })
  async removeMember(
    @GetUser('id') requesterId: string,
    @Param('id') familyId: string,
    @Param('userId') userId: string,
  ) {
    await this.familyService.removeMember(familyId, userId, requesterId);
    return { success: true };
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: '가족 그룹 나가기' })
  async leave(@GetUser('id') userId: string, @Param('id') familyId: string) {
    await this.familyService.leave(familyId, userId);
    return { success: true };
  }
}
