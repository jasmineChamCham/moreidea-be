import { Controller, Post, Body } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchRelatedAnchorsQuery } from './searchRelatedAnchors.query';
import { SearchRelatedAnchorsQueryResponse } from './searchRelatedAnchors.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Anchors')
@Controller({ path: 'anchors', version: '1' })
export class SearchRelatedAnchorsEndpoint {
  constructor(private readonly queryBus: QueryBus) { }

  @Post('search')
  async execute(@Body() body: { searchText: string }): Promise<SearchRelatedAnchorsQueryResponse> {
    return await this.queryBus.execute(new SearchRelatedAnchorsQuery(body.searchText));
  }
}
