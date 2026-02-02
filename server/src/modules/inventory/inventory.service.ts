import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto, InventoryFilterDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getItems(userId: string, filter: InventoryFilterDto) {
    const where: any = {
      OR: [
        { userId },
        { family: { members: { some: { userId } } } },
      ],
    };

    if (filter.category) {
      where.category = filter.category;
    }

    if (filter.storage) {
      where.storageLocation = filter.storage;
    }

    if (filter.familyId) {
      where.familyId = filter.familyId;
    }

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (filter.expiringSoon) {
      where.expiryDate = {
        lte: sevenDaysLater,
        gte: now,
      };
    }

    const items = await this.prisma.inventoryItem.findMany({
      where,
      orderBy: [
        { expiryDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Calculate days until expiry for each item
    const itemsWithExpiry = items.map((item) => ({
      ...item,
      daysUntilExpiry: item.expiryDate
        ? Math.ceil((item.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }));

    // Calculate summary
    const summary = {
      total: items.length,
      expiringSoon: items.filter(
        (item) =>
          item.expiryDate &&
          item.expiryDate <= sevenDaysLater &&
          item.expiryDate >= now
      ).length,
      expired: items.filter(
        (item) => item.expiryDate && item.expiryDate < now
      ).length,
    };

    return { items: itemsWithExpiry, summary };
  }

  async getItem(userId: string, id: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { family: { members: { some: { userId } } } },
        ],
      },
    });

    if (!item) {
      throw new NotFoundException('재고 아이템을 찾을 수 없습니다');
    }

    return item;
  }

  async createItem(userId: string, dto: CreateInventoryDto) {
    return this.prisma.inventoryItem.create({
      data: {
        userId,
        name: dto.name,
        category: dto.category,
        quantity: dto.quantity,
        unit: dto.unit,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        price: dto.price,
        storageLocation: dto.storageLocation,
        familyId: dto.familyId,
      },
    });
  }

  async updateItem(userId: string, id: string, dto: UpdateInventoryDto) {
    // Verify ownership
    await this.getItem(userId, id);

    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
        quantity: dto.quantity,
        unit: dto.unit,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        price: dto.price,
        storageLocation: dto.storageLocation,
      },
    });
  }

  async deleteItem(userId: string, id: string) {
    // Verify ownership
    await this.getItem(userId, id);

    await this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  async consumeItem(userId: string, id: string, quantity: number) {
    const item = await this.getItem(userId, id);

    const newQuantity = item.quantity - quantity;

    if (newQuantity <= 0) {
      await this.prisma.inventoryItem.delete({
        where: { id },
      });
      return { ...item, quantity: 0 };
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }
}
