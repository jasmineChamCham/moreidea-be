import { Controller, Post, Body } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchRelatedAnchorsQuery } from './searchRelatedAnchors.query';
import { SearchRelatedAnchorsQueryResponse } from './searchRelatedAnchors.query';

@Controller('anchors')
export class SearchRelatedAnchorsEndpoint {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('search')
  async execute(@Body() body: { searchText: string }): Promise<SearchRelatedAnchorsQueryResponse> {
    return await this.queryBus.execute(new SearchRelatedAnchorsQuery(body.searchText));
  }
}
