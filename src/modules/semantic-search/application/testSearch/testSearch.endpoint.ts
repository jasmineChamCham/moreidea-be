import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TestSearchQuery } from './testSearch.query';

@ApiTags('semantic-search')
@Controller({ path: 'semantic-search', version: '1' })
export class TestSearchEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @Get('test')
  @ApiOperation({ summary: 'Test semantic search functionality' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Test search completed' })
  public testSearch(@Query('query') query: string) {
    return this.queryBus.execute(new TestSearchQuery(query));
  }
}
