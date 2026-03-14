import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateQuoteCommand } from './updateQuote.command';
import { UpdateQuoteRequestBody } from './updateQuote.request-body';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class UpdateQuoteEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Update a quote' })
  @Patch(':id')
  public update(@Param('id') id: string, @Body() body: UpdateQuoteRequestBody) {
    return this.commandBus.execute(
      new UpdateQuoteCommand(id, body.quote, body.photoUrl),
    );
  }
}
