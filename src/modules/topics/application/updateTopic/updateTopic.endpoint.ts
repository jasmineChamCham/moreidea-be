import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { UpdateTopicCommand, UpdateTopicDto } from './updateTopic.command';

@ApiTags('Topics')
@Controller({ path: 'topics', version: '1' })
export class UpdateTopicEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update a topic' })
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.commandBus.execute(new UpdateTopicCommand(id, dto));
  }
}
