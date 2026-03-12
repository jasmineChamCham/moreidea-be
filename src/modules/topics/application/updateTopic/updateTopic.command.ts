import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTopicDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateTopicCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateTopicDto,
  ) {}
}
