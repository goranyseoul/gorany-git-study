import { Test, TestingModule } from '@nestjs/testing';
import { FamilyService } from '../family.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  family: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  familyMember: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  user: {
    update: jest.fn(),
  },
  inventoryItem: {
    updateMany: jest.fn(),
  },
};

describe('FamilyService', () => {
  let service: FamilyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FamilyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FamilyService>(FamilyService);
    jest.clearAllMocks();
  });

  describe('createFamily', () => {
    // TC-FAMILY-001: 가족 그룹 생성
    it('should create family and generate invite code', async () => {
      const userId = 'user-1';
      const name = '우리 가족';

      mockPrismaService.family.create.mockResolvedValue({
        id: 'family-1',
        name,
        inviteCode: 'ABC123',
        createdAt: new Date(),
      });

      mockPrismaService.familyMember.create.mockResolvedValue({
        familyId: 'family-1',
        userId,
        role: 'owner',
      });

      const result = await service.createFamily(userId, name);

      expect(result).toHaveProperty('inviteCode');
      expect(result.inviteCode).toHaveLength(6);
      expect(result.name).toBe(name);
    });

    it('should set creator as owner', async () => {
      const userId = 'user-1';
      const name = '우리 가족';

      mockPrismaService.family.create.mockResolvedValue({
        id: 'family-1',
        name,
        inviteCode: 'ABC123',
      });

      await service.createFamily(userId, name);

      expect(mockPrismaService.familyMember.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          role: 'owner',
        }),
      });
    });
  });

  describe('joinFamily', () => {
    // TC-FAMILY-002: 초대 코드로 참여
    it('should join family with valid invite code', async () => {
      const userId = 'user-2';
      const inviteCode = 'ABC123';

      mockPrismaService.family.findFirst.mockResolvedValue({
        id: 'family-1',
        name: '우리 가족',
        inviteCode,
      });

      mockPrismaService.familyMember.findFirst.mockResolvedValue(null);

      mockPrismaService.familyMember.create.mockResolvedValue({
        familyId: 'family-1',
        userId,
        role: 'member',
      });

      const result = await service.joinFamily(userId, inviteCode);

      expect(result.role).toBe('member');
    });

    it('should throw error for invalid invite code', async () => {
      mockPrismaService.family.findFirst.mockResolvedValue(null);

      await expect(
        service.joinFamily('user-2', 'INVALID'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if already a member', async () => {
      mockPrismaService.family.findFirst.mockResolvedValue({
        id: 'family-1',
        inviteCode: 'ABC123',
      });

      mockPrismaService.familyMember.findFirst.mockResolvedValue({
        familyId: 'family-1',
        userId: 'user-2',
      });

      await expect(
        service.joinFamily('user-2', 'ABC123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('shareInventory', () => {
    // TC-FAMILY-003: 재고 공유
    it('should share inventory with family members', async () => {
      const familyId = 'family-1';

      mockPrismaService.familyMember.findMany.mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
      ]);

      await service.syncInventory(familyId);

      // Inventory should be accessible by all family members
      expect(mockPrismaService.inventoryItem.updateMany).toHaveBeenCalledWith({
        where: {
          userId: { in: ['user-1', 'user-2'] },
        },
        data: {
          familyId,
        },
      });
    });
  });

  describe('leaveFamily', () => {
    // TC-FAMILY-004: 가족 탈퇴
    it('should remove member from family', async () => {
      const userId = 'user-2';
      const familyId = 'family-1';

      mockPrismaService.familyMember.findFirst.mockResolvedValue({
        familyId,
        userId,
        role: 'member',
      });

      mockPrismaService.familyMember.delete.mockResolvedValue({});

      await service.leaveFamily(userId);

      expect(mockPrismaService.familyMember.delete).toHaveBeenCalled();
    });

    it('should not allow owner to leave without transferring ownership', async () => {
      const userId = 'user-1';

      mockPrismaService.familyMember.findFirst.mockResolvedValue({
        familyId: 'family-1',
        userId,
        role: 'owner',
      });

      mockPrismaService.familyMember.findMany.mockResolvedValue([
        { userId: 'user-1', role: 'owner' },
        { userId: 'user-2', role: 'member' },
      ]);

      await expect(service.leaveFamily(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('regenerateInviteCode', () => {
    it('should generate new invite code', async () => {
      const familyId = 'family-1';
      const userId = 'user-1';

      mockPrismaService.familyMember.findFirst.mockResolvedValue({
        familyId,
        userId,
        role: 'owner',
      });

      mockPrismaService.family.update.mockResolvedValue({
        id: familyId,
        inviteCode: 'NEWCODE',
      });

      const result = await service.regenerateInviteCode(userId);

      expect(result.inviteCode).toBe('NEWCODE');
    });
  });
});
