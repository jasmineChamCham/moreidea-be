import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteMentorCommand } from './deleteMentor.command';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class DeleteMentorEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a mentor' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteMentorCommand(id));
  }
}
