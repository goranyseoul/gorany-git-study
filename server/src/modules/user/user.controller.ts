import { Controller, Get, Patch, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto, UpdatePreferenceDto } from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보 조회' })
  async getMe(@GetUser('id') userId: string) {
    const user = await this.userService.findById(userId);
    return { success: true, data: user };
  }

  @Patch('me')
  @ApiOperation({ summary: '내 정보 수정' })
  async updateMe(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(userId, dto);
    return { success: true, data: user };
  }

  @Put('me/preference')
  @ApiOperation({ summary: '선호도 설정' })
  async updatePreference(
    @GetUser('id') userId: string,
    @Body() dto: UpdatePreferenceDto,
  ) {
    const preference = await this.userService.updatePreference(userId, dto);
    return { success: true, data: preference };
  }

  @Get('me/preference')
  @ApiOperation({ summary: '선호도 조회' })
  async getPreference(@GetUser('id') userId: string) {
    const preference = await this.userService.getPreference(userId);
    return { success: true, data: preference };
  }
}
