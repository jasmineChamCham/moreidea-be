import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSourceIdeaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ideaText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  core?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  importance?: string;
}

export class UpdateSourceIdeaCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateSourceIdeaDto,
  ) {}
}
