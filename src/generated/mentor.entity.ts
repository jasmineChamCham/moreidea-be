import { ApiProperty } from '@nestjs/swagger';
import { BookVideoSourceEntity } from './book-video-source.entity';
import { MentorTopicEntity } from './mentor-topic.entity';
import { QuoteEntity } from './quote.entity';

export class MentorEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  style: string | null;
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
    type: 'string',
    nullable: true,
  })
  bio: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  bodyLanguage: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  era: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  mindset: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  philosophy: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  speakingStyle: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  archetype: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  avatarUrl: string | null;
  @ApiProperty({
    type: () => BookVideoSourceEntity,
    isArray: true,
    required: false,
  })
  sources?: BookVideoSourceEntity[];
  @ApiProperty({
    type: () => MentorTopicEntity,
    isArray: true,
    required: false,
  })
  topics?: MentorTopicEntity[];
  @ApiProperty({
    type: () => QuoteEntity,
    isArray: true,
    required: false,
  })
  quotes?: QuoteEntity[];
}
