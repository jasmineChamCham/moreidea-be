import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuoteDto } from 'src/generated/create-quote.dto';
import { CreateQuoteCommand } from './createQuote.command';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class CreateQuoteEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Create a new quote' })
  @Post()
  public create(@Body() body: CreateQuoteDto) {
    return this.commandBus.execute(
      new CreateQuoteCommand(body.mentorId, body.quote, body.place, body.photoUrl),
    );
  }
}
