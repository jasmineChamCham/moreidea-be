import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TestSearchQuery } from './testSearch.query';
import { SearchRelevantContentQuery } from '../searchRelevantContent/searchRelevantContent.query';
import { SearchRelevantContentHandler } from '../searchRelevantContent/searchRelevantContent.handler';

@QueryHandler(TestSearchQuery)
export class TestSearchHandler implements IQueryHandler<TestSearchQuery> {
  constructor(
    private readonly searchHandler: SearchRelevantContentHandler
  ) { }

  public async execute({ query }: TestSearchQuery) {
    const results = await this.searchHandler.execute(
      new SearchRelevantContentQuery(
        query,
        10
      )
    );

    return {
      query,
      count: results.length,
      results,
    };
  }
}
