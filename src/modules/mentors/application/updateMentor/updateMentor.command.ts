import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMentorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

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

export class UpdateMentorCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateMentorDto,
  ) {}
}
