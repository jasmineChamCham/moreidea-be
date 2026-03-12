import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { DeleteTopicCommand } from './deleteTopic.command';

@ApiTags('Topics')
@Controller({ path: 'topics', version: '1' })
export class DeleteTopicEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a topic' })
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteTopicCommand(id));
  }
}
