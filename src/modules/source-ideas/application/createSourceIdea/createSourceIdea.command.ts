import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSourceIdeaDto {
  @ApiProperty()
  @IsString()
  ideaText: string;

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

export class CreateSourceIdeaCommand {
  constructor(
    public readonly sourceId: string,
    public readonly dto: CreateSourceIdeaDto,
  ) {}
}
