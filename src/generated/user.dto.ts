import {
  LoginType,
  LoveLanguage,
  MBTI,
  RoleType,
  ZodiacSign,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  displayName: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  avatarUrl: string | null;
  @ApiProperty({
    enum: RoleType,
    enumName: 'RoleType',
  })
  role: RoleType;
  @ApiProperty({
    type: 'string',
  })
  email: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  password: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isAllowUserData: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  isEmailVerified: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  verificationToken: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  verificationTokenExpiresAt: Date | null;
  @ApiProperty({
    enum: LoginType,
    enumName: 'LoginType',
  })
  loginType: LoginType;
  @ApiProperty({
    enum: MBTI,
    enumName: 'MBTI',
    nullable: true,
  })
  mbti: MBTI | null;
  @ApiProperty({
    enum: ZodiacSign,
    enumName: 'ZodiacSign',
    nullable: true,
  })
  zodiacSign: ZodiacSign | null;
  @ApiProperty({
    isArray: true,
    enum: LoveLanguage,
    enumName: 'LoveLanguage',
  })
  loveLanguages: LoveLanguage[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
