import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteSourceIdeaCommand } from './deleteSourceIdea.command';

@ApiTags('Source Ideas')
@Controller({ path: 'ideas', version: '1' })
export class DeleteSourceIdeaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete an idea' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteSourceIdeaCommand(id));
  }
}
