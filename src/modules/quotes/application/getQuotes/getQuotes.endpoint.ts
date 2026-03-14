import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetQuotesQuery } from './getQuotes.query';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class GetQuotesEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all quotes' })
  @Get()
  public get() {
    return this.queryBus.execute(new GetQuotesQuery());
  }
}
