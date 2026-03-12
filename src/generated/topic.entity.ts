import { ApiProperty } from '@nestjs/swagger';
import { MentorTopicEntity } from './mentor-topic.entity';
import { SourceIdeaEntity } from './source-idea.entity';

export class TopicEntity {
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
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: () => MentorTopicEntity,
    isArray: true,
    required: false,
  })
  mentorTopics?: MentorTopicEntity[];
  @ApiProperty({
    type: () => SourceIdeaEntity,
    isArray: true,
    required: false,
  })
  ideas?: SourceIdeaEntity[];
}
