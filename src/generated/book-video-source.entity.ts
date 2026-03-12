import { SourceType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { SourceIdeaEntity } from './source-idea.entity';

export class BookVideoSourceEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  sourceTitle: string;
  @ApiProperty({
    enum: SourceType,
    enumName: 'SourceType',
  })
  sourceType: SourceType;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  creator: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  sourceUrl: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  filePath: string | null;
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
    type: () => SourceIdeaEntity,
    isArray: true,
    required: false,
  })
  ideas?: SourceIdeaEntity[];
}
