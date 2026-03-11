import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteSourceCommand } from './deleteSource.command';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class DeleteSourceEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a source and all its ideas' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteSourceCommand(id));
  }
}
