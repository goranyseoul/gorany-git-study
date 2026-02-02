import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FamilyService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    // Generate unique invite code
    const inviteCode = this.generateInviteCode();

    const family = await this.prisma.family.create({
      data: {
        name,
        inviteCode,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, profileImage: true },
            },
          },
        },
      },
    });

    return family;
  }

  async join(userId: string, inviteCode: string) {
    const family = await this.prisma.family.findUnique({
      where: { inviteCode },
    });

    if (!family) {
      throw new BadRequestException('유효하지 않은 초대 코드입니다');
    }

    // Check if already a member
    const existingMember = await this.prisma.familyMember.findUnique({
      where: {
        familyId_userId: {
          familyId: family.id,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('이미 가족 그룹에 참여하고 있습니다');
    }

    await this.prisma.familyMember.create({
      data: {
        familyId: family.id,
        userId,
        role: 'member',
      },
    });

    return this.findById(family.id);
  }

  async findById(id: string) {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, profileImage: true },
            },
          },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('가족 그룹을 찾을 수 없습니다');
    }

    return family;
  }

  async findByUserId(userId: string) {
    const membership = await this.prisma.familyMember.findFirst({
      where: { userId },
      include: {
        family: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, profileImage: true },
                },
              },
            },
          },
        },
      },
    });

    return membership?.family || null;
  }

  async getMembers(familyId: string) {
    const members = await this.prisma.familyMember.findMany({
      where: { familyId },
      include: {
        user: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });

    return members;
  }

  async removeMember(familyId: string, userId: string, requesterId: string) {
    const family = await this.findById(familyId);

    // Check if requester is owner
    if (family.ownerId !== requesterId) {
      throw new BadRequestException('가족 그룹 소유자만 멤버를 삭제할 수 있습니다');
    }

    // Cannot remove owner
    if (userId === family.ownerId) {
      throw new BadRequestException('소유자는 삭제할 수 없습니다');
    }

    await this.prisma.familyMember.delete({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });
  }

  async leave(familyId: string, userId: string) {
    const family = await this.findById(familyId);

    // Owner cannot leave, must transfer ownership first
    if (family.ownerId === userId) {
      throw new BadRequestException(
        '소유자는 가족 그룹을 떠날 수 없습니다. 소유권을 이전하거나 그룹을 삭제해주세요.',
      );
    }

    await this.prisma.familyMember.delete({
      where: {
        familyId_userId: {
          familyId,
          userId,
        },
      },
    });
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
