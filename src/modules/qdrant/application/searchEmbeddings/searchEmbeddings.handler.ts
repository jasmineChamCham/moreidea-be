import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchEmbeddingsQuery } from './searchEmbeddings.query';
import { QdrantService } from '../../qdrant.service';
import { SearchContentType } from 'src/common/enum';

@QueryHandler(SearchEmbeddingsQuery)
export class SearchEmbeddingsHandler implements IQueryHandler<SearchEmbeddingsQuery> {
  constructor(
    private readonly qdrantService: QdrantService,
  ) { }

  public async execute(query: SearchEmbeddingsQuery) {
    const limit = Math.floor(query.limit / 2);
    const quotes = await this.qdrantService.searchQuotes(query.queryEmbedding, limit);
    const sourceIdeas = await this.qdrantService.searchSourceIdeas(query.queryEmbedding, limit);
    return { quotes, sourceIdeas };
  }
}
