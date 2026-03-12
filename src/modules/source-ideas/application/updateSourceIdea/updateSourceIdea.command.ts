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
  topicId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  core?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  importance?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  application?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  example?: string;
}

export class UpdateSourceIdeaCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateSourceIdeaDto,
  ) {}
}
