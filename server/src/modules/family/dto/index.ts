import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ example: '우리집' })
  @IsString()
  @MinLength(1)
  name: string;
}

export class JoinFamilyDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  inviteCode: string;
}
