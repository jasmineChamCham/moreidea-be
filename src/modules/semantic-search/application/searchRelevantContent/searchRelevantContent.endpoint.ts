import { Controller, Post, Body } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchRelevantContentQuery } from './searchRelevantContent.query';

@ApiTags('semantic-search')
@Controller({ path: 'semantic-search', version: '1' })
export class SearchRelevantContentEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @Post('search')
  @ApiOperation({ summary: 'Search for relevant quotes and ideas' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  public search(@Body() body: { query: string; limit?: number }) {
    const { query, limit = 100 } = body;
    return this.queryBus.execute(new SearchRelevantContentQuery(query, limit));
  }
}
