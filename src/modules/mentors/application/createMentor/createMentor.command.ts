import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMentorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  philosophy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mindset?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  speakingStyle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bodyLanguage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  era?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  archetype?: string;
}

export class CreateMentorCommand {
  constructor(public readonly dto: CreateMentorDto) {}
}
