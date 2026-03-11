import { RoleType, MBTI, LoveLanguage, ZodiacSign } from '@prisma/client';

export class LoginUserDto {
  id: string;
  avatarUrl: string;
  email: string;
  role: RoleType;
  zodiacSign: ZodiacSign;
  displayName: string;
  mbti: MBTI;
  loveLanguages: LoveLanguage[];
  deviceId?: string;
  createdAt: Date;
}
