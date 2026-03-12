import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { UpdateMentorQuoteCommand, UpdateMentorQuoteDto } from './updateMentorQuote.command';

@ApiTags('Mentor Quotes')
@Controller({ path: 'mentors/:mentorId/quotes', version: '1' })
export class UpdateMentorQuoteEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update a quote for a mentor' })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateMentorQuoteDto,
  ) {
    return this.commandBus.execute(new UpdateMentorQuoteCommand(id, dto));
  }
}
