import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoSourceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitles?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mentorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  creator?: string;
}

export class CreateVideoSourceCommand {
  constructor(public readonly dto: CreateVideoSourceDto) { }
}
