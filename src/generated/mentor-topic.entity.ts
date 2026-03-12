import { ApiProperty } from '@nestjs/swagger';
import { MentorEntity } from './mentor.entity';
import { TopicEntity } from './topic.entity';

export class MentorTopicEntity {
  @ApiProperty({
    type: 'string',
  })
  mentorId: string;
  @ApiProperty({
    type: 'string',
  })
  topicId: string;
  @ApiProperty({
    type: () => MentorEntity,
    required: false,
  })
  mentor?: MentorEntity;
  @ApiProperty({
    type: () => TopicEntity,
    required: false,
  })
  topic?: TopicEntity;
}
