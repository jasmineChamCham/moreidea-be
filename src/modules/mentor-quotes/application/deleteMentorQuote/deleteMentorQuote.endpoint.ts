import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { DeleteMentorQuoteCommand } from './deleteMentorQuote.command';

@ApiTags('Mentor Quotes')
@Controller({ path: 'mentors/:mentorId/quotes', version: '1' })
export class DeleteMentorQuoteEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a quote for a mentor' })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteMentorQuoteCommand(id));
  }
}
