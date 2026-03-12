import { MBTI, ZodiacSign } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  displayName?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  password?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  verificationToken?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  verificationTokenExpiresAt?: Date | null;
  @ApiProperty({
    enum: MBTI,
    enumName: 'MBTI',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(MBTI)
  mbti?: MBTI | null;
  @ApiProperty({
    enum: ZodiacSign,
    enumName: 'ZodiacSign',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ZodiacSign)
  zodiacSign?: ZodiacSign | null;
}
