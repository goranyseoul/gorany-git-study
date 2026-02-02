import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { OcrService } from './ocr.service';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryFilterDto,
  ConsumeDto,
  ScanReceiptDto,
} from './dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private ocrService: OcrService,
  ) {}

  @Get()
  @ApiOperation({ summary: '재고 목록 조회' })
  async getItems(@GetUser('id') userId: string, @Query() filter: InventoryFilterDto) {
    const result = await this.inventoryService.getItems(userId, filter);
    return { success: true, data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '재고 상세 조회' })
  async getItem(@GetUser('id') userId: string, @Param('id') id: string) {
    const item = await this.inventoryService.getItem(userId, id);
    return { success: true, data: item };
  }

  @Post()
  @ApiOperation({ summary: '재고 추가' })
  async createItem(@GetUser('id') userId: string, @Body() dto: CreateInventoryDto) {
    const item = await this.inventoryService.createItem(userId, dto);
    return { success: true, data: item };
  }

  @Post('scan')
  @ApiOperation({ summary: '영수증 OCR 스캔' })
  async scanReceipt(@Body() dto: ScanReceiptDto) {
    const result = await this.ocrService.scanReceipt(dto.imageUrl);
    return { success: true, data: result };
  }

  @Patch(':id')
  @ApiOperation({ summary: '재고 수정' })
  async updateItem(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    const item = await this.inventoryService.updateItem(userId, id, dto);
    return { success: true, data: item };
  }

  @Delete(':id')
  @ApiOperation({ summary: '재고 삭제' })
  async deleteItem(@GetUser('id') userId: string, @Param('id') id: string) {
    await this.inventoryService.deleteItem(userId, id);
    return { success: true };
  }

  @Post(':id/consume')
  @ApiOperation({ summary: '재고 소비' })
  async consumeItem(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ConsumeDto,
  ) {
    const item = await this.inventoryService.consumeItem(userId, id, dto.quantity);
    return { success: true, data: item };
  }
}
