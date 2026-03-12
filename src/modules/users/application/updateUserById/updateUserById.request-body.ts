import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsArray,
  IsOptional,
  Matches,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { MBTI, LoveLanguage, ZodiacSign, RoleType } from '@prisma/client';

export class UpdateUserByIdRequestBody {
  @ApiPropertyOptional({
    description: 'Display Name',
    maxLength: 255,
    example: 'Brita',
  })
  @IsOptional()
  @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    maxLength: 255,
    example:
      'https://nationaltoday.com/wp-content/uploads/2021/09/American-Business-Womens-Day-1200x834.jpg',
  })
  @IsOptional()
  @MaxLength(255, { message: 'Avatar cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Email',
    maxLength: 255,
    example: 'brita@datahouse.com',
  })
  @Matches('^[a-zA-Z0-9_]+@[a-z]+\.(com)', '', {
    message: 'Email is not the right format',
  })
  @IsOptional()
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;

  @ApiPropertyOptional({
    description: 'Role of user',
    enum: RoleType,
    example: RoleType.USER,
  })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;

  @ApiPropertyOptional({
    description: 'MBTI of user',
    enum: MBTI,
    example: MBTI.INFJ,
  })
  @IsOptional()
  @IsEnum(MBTI)
  mbti?: MBTI;

  @ApiPropertyOptional({
    description: 'Zodiac Sign of user',
    enum: ZodiacSign,
    example: ZodiacSign.cancer,
  })
  @IsOptional()
  @IsEnum(ZodiacSign)
  zodiacSign?: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Love Languages of user',
    enum: LoveLanguage,
    isArray: true,
    example: [LoveLanguage.quality_time],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LoveLanguage, { each: true })
  loveLanguages?: LoveLanguage[];

  @ApiPropertyOptional({
    description: 'Allow user data usage',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAllowUserData?: boolean;
}
