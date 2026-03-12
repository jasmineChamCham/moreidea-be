import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateMentorQuoteCommand, CreateMentorQuoteDto } from './createMentorQuote.command';

@ApiTags('Mentor Quotes')
@Controller({ path: 'mentors/:mentorId/quotes', version: '1' })
export class CreateMentorQuoteEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a new quote for a mentor' })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @Post()
  public create(
    @Param('mentorId') mentorId: string,
    @Body() dto: CreateMentorQuoteDto,
  ) {
    return this.commandBus.execute(new CreateMentorQuoteCommand(mentorId, dto));
  }
}
