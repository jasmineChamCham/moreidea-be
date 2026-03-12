import { ApiProperty } from '@nestjs/swagger';
import { BookVideoSourceEntity } from './book-video-source.entity';

export class SourceIdeaEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  sourceId: string;
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
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: () => BookVideoSourceEntity,
    required: false,
  })
  source?: BookVideoSourceEntity;
}
