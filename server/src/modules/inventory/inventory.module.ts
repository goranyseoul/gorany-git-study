import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, OcrService],
  exports: [InventoryService],
})
export class InventoryModule {}
