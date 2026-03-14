import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuoteCommand } from './createQuote.command';
import { CreateQuoteRequestBody } from './createQuote.request-body';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class CreateQuoteEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Create a new quote' })
  @Post()
  public create(@Body() body: CreateQuoteRequestBody) {
    return this.commandBus.execute(
      new CreateQuoteCommand(body.mentorId, body.quote, body.photoUrl),
    );
  }
}
