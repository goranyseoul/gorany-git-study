import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from '../inventory.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  inventoryItem: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    // TC-INV-001: 재고 수동 추가
    it('should create inventory item successfully', async () => {
      const userId = 'user-1';
      const createDto = {
        name: '우유',
        quantity: 2,
        unit: '개',
        expiryDate: new Date('2025-02-10'),
        storageLocation: 'refrigerator' as const,
        category: '유제품',
      };

      mockPrismaService.inventoryItem.create.mockResolvedValue({
        id: 'item-1',
        ...createDto,
        userId,
        createdAt: new Date(),
      });

      const result = await service.create(userId, createDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(createDto.name);
      expect(result.quantity).toBe(createDto.quantity);
    });
  });

  describe('findAll', () => {
    it('should return all inventory items for user', async () => {
      const userId = 'user-1';
      const mockItems = [
        { id: 'item-1', name: '우유', quantity: 2 },
        { id: 'item-2', name: '계란', quantity: 10 },
      ];

      mockPrismaService.inventoryItem.findMany.mockResolvedValue(mockItems);

      const result = await service.findAll(userId);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId } }),
      );
    });

    // TC-INV-007: 카테고리 필터링
    it('should filter by category', async () => {
      const userId = 'user-1';
      const category = '채소';

      mockPrismaService.inventoryItem.findMany.mockResolvedValue([]);

      await service.findAll(userId, { category });

      expect(mockPrismaService.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, category },
        }),
      );
    });

    // TC-INV-008: 보관위치 필터링
    it('should filter by storage location', async () => {
      const userId = 'user-1';
      const storageLocation = 'freezer';

      mockPrismaService.inventoryItem.findMany.mockResolvedValue([]);

      await service.findAll(userId, { storageLocation });

      expect(mockPrismaService.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, storageLocation },
        }),
      );
    });
  });

  describe('consume', () => {
    // TC-INV-004: 재고 수량 감소 (소비)
    it('should decrease quantity when consuming', async () => {
      const itemId = 'item-1';
      const userId = 'user-1';
      const mockItem = { id: itemId, name: '우유', quantity: 5, userId };

      mockPrismaService.inventoryItem.findUnique.mockResolvedValue(mockItem);
      mockPrismaService.inventoryItem.update.mockResolvedValue({
        ...mockItem,
        quantity: 3,
      });

      const result = await service.consume(itemId, userId, 2);

      expect(result.quantity).toBe(3);
    });

    it('should delete item when quantity becomes zero', async () => {
      const itemId = 'item-1';
      const userId = 'user-1';
      const mockItem = { id: itemId, name: '우유', quantity: 2, userId };

      mockPrismaService.inventoryItem.findUnique.mockResolvedValue(mockItem);
      mockPrismaService.inventoryItem.delete.mockResolvedValue(mockItem);

      const result = await service.consume(itemId, userId, 2);

      expect(mockPrismaService.inventoryItem.delete).toHaveBeenCalled();
      expect(result).toHaveProperty('deleted', true);
    });

    it('should throw error when consuming more than available', async () => {
      const itemId = 'item-1';
      const userId = 'user-1';
      const mockItem = { id: itemId, name: '우유', quantity: 2, userId };

      mockPrismaService.inventoryItem.findUnique.mockResolvedValue(mockItem);

      await expect(service.consume(itemId, userId, 5)).rejects.toThrow(
        '재고보다 많은 수량을 소비할 수 없습니다',
      );
    });
  });

  describe('delete', () => {
    // TC-INV-005: 재고 삭제
    it('should delete inventory item', async () => {
      const itemId = 'item-1';
      const userId = 'user-1';
      const mockItem = { id: itemId, name: '우유', userId };

      mockPrismaService.inventoryItem.findUnique.mockResolvedValue(mockItem);
      mockPrismaService.inventoryItem.delete.mockResolvedValue(mockItem);

      await service.delete(itemId, userId);

      expect(mockPrismaService.inventoryItem.delete).toHaveBeenCalledWith({
        where: { id: itemId },
      });
    });

    it('should throw NotFoundException for non-existent item', async () => {
      mockPrismaService.inventoryItem.findUnique.mockResolvedValue(null);

      await expect(service.delete('invalid-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getExpiringItems', () => {
    // TC-INV-006: 유통기한 임박 표시
    it('should return items expiring within specified days', async () => {
      const userId = 'user-1';
      const today = new Date();
      const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

      const mockItems = [
        { id: 'item-1', name: '우유', expiryDate: threeDaysLater },
      ];

      mockPrismaService.inventoryItem.findMany.mockResolvedValue(mockItems);

      const result = await service.getExpiringItems(userId, 3);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('우유');
    });
  });

  describe('bulkCreate (OCR result)', () => {
    // TC-INV-002, TC-INV-003: 영수증 OCR 스캔 결과 저장
    it('should create multiple items from OCR result', async () => {
      const userId = 'user-1';
      const ocrItems = [
        { name: '우유', quantity: 1, price: 3500 },
        { name: '계란', quantity: 1, price: 6000 },
      ];

      mockPrismaService.inventoryItem.create
        .mockResolvedValueOnce({ id: 'item-1', ...ocrItems[0], userId })
        .mockResolvedValueOnce({ id: 'item-2', ...ocrItems[1], userId });

      const result = await service.bulkCreate(userId, ocrItems);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.inventoryItem.create).toHaveBeenCalledTimes(2);
    });
  });
});
