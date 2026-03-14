import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { DeleteQuoteCommand } from './deleteQuote.command';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class DeleteQuoteEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a quote' })
  @ApiParam({ name: 'id', description: 'Quote ID' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteQuoteCommand(id));
  }
}
