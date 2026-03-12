import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateTopicCommand {
  constructor(public readonly dto: CreateTopicDto) {}
}
