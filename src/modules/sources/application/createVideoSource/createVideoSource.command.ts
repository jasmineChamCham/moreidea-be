import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoSourceDto {
  @ApiProperty()
  @IsString()
  sourceUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sourceTitle?: string;
}

export class CreateVideoSourceCommand {
  constructor(public readonly dto: CreateVideoSourceDto) {}
}
