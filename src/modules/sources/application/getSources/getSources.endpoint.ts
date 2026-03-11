import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSourcesQuery } from './getSources.query';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class GetSourcesEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all book/video sources' })
  @Get()
  public get() {
    return this.queryBus.execute(new GetSourcesQuery());
  }
}
