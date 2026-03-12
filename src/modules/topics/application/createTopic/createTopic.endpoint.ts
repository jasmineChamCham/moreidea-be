import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTopicCommand, CreateTopicDto } from './createTopic.command';

@ApiTags('Topics')
@Controller({ path: 'topics', version: '1' })
export class CreateTopicEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a new topic' })
  @Post()
  public create(@Body() dto: CreateTopicDto) {
    return this.commandBus.execute(new CreateTopicCommand(dto));
  }
}
