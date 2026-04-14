import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateContentDto {
  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty({ required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  ideas?: any[];
}

export class GenerateContentCommand {
  constructor(public readonly dto: GenerateContentDto) {}
}
