import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class UpdatePreferenceDto {
  @ApiProperty({ required: false, example: 170 })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiProperty({ required: false, example: 65 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  weight?: number;

  @ApiProperty({ required: false, example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(120)
  age?: number;

  @ApiProperty({ required: false, enum: ['male', 'female'] })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsString()
  activityLevel?: string;

  @ApiProperty({ required: false, example: ['diabetes', 'keto'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietTypes?: string[];

  @ApiProperty({ required: false, example: ['땅콩'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dislikedFoods?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteFoods?: string[];

  @ApiProperty({ required: false, example: 1800 })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(5000)
  targetCalories?: number;
}
