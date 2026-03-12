import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTopicsQuery } from './getTopics.query';

@ApiTags('Topics')
@Controller({ path: 'topics', version: '1' })
export class GetTopicsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all topics' })
  @Get()
  public get() {
    return this.queryBus.execute(new GetTopicsQuery());
  }
}
