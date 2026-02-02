import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateInventoryDto {
  @ApiProperty({ example: '우유' })
  @IsString()
  name: string;

  @ApiProperty({ example: '유제품' })
  @IsString()
  category: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0, { message: '수량은 0 이상이어야 합니다' })
  quantity: number;

  @ApiProperty({ example: '개' })
  @IsString()
  unit: string;

  @ApiProperty({ required: false, example: '2024-01-10' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({ required: false, example: '2024-01-20' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false, example: 3000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false, example: 'refrigerator' })
  @IsOptional()
  @IsString()
  storageLocation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  familyId?: string;
}

export class UpdateInventoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: '수량은 0 이상이어야 합니다' })
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storageLocation?: string;
}

export class InventoryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  expiringSoon?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  familyId?: string;
}

export class ConsumeDto {
  @ApiProperty({ example: 1, description: '소비할 수량' })
  @IsNumber()
  @Min(0.01, { message: '소비 수량은 0보다 커야 합니다' })
  quantity: number;
}

export class ScanReceiptDto {
  @ApiProperty()
  @IsString()
  imageUrl: string;
}
