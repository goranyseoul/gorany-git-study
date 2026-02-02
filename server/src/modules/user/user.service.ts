import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, UpdatePreferenceDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        preference: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        profileImage: dto.profileImage,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        isSupporter: true,
      },
    });
  }

  async updatePreference(userId: string, dto: UpdatePreferenceDto) {
    const preference = await this.prisma.userPreference.upsert({
      where: { userId },
      update: {
        height: dto.height,
        weight: dto.weight,
        age: dto.age,
        gender: dto.gender,
        activityLevel: dto.activityLevel,
        dietTypes: dto.dietTypes,
        allergies: dto.allergies,
        dislikedFoods: dto.dislikedFoods,
        favoriteFoods: dto.favoriteFoods,
        targetCalories: dto.targetCalories,
      },
      create: {
        userId,
        height: dto.height,
        weight: dto.weight,
        age: dto.age,
        gender: dto.gender,
        activityLevel: dto.activityLevel,
        dietTypes: dto.dietTypes || [],
        allergies: dto.allergies || [],
        dislikedFoods: dto.dislikedFoods || [],
        favoriteFoods: dto.favoriteFoods || [],
        targetCalories: dto.targetCalories,
      },
    });

    return preference;
  }

  async getPreference(userId: string) {
    const preference = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    return preference;
  }
}
