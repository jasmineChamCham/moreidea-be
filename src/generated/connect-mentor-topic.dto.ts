import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MentorTopicMentorIdTopicIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  mentorId: string;
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  topicId: string;
}

@ApiExtraModels(MentorTopicMentorIdTopicIdUniqueInputDto)
export class ConnectMentorTopicDto {
  @ApiProperty({
    type: MentorTopicMentorIdTopicIdUniqueInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MentorTopicMentorIdTopicIdUniqueInputDto)
  mentorId_topicId: MentorTopicMentorIdTopicIdUniqueInputDto;
}
