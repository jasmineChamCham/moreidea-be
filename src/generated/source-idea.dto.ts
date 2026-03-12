import { ApiProperty } from '@nestjs/swagger';

export class SourceIdeaDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  ideaText: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  core: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  importance: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  application: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  example: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
