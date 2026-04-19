import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SearchRelatedAnchorsQuery,
  SearchRelatedAnchorsQueryResponse,
} from './searchRelatedAnchors.query';
import { QdrantService } from 'src/modules/qdrant/qdrant.service';
import { EmbeddingsService } from 'src/modules/embeddings/embeddings.service';

@QueryHandler(SearchRelatedAnchorsQuery)
export class SearchRelatedAnchorsHandler implements IQueryHandler<
  SearchRelatedAnchorsQuery,
  SearchRelatedAnchorsQueryResponse
> {
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  async execute(
    query: SearchRelatedAnchorsQuery,
  ): Promise<SearchRelatedAnchorsQueryResponse> {
    // Get embedding for the search text using embeddings service
    const queryEmbedding = await this.embeddingsService.generateEmbedding(
      query.searchText,
    );

    // Search for related anchors in Qdrant
    const searchResults = await this.qdrantService.searchAnchors(
      queryEmbedding,
      20,
    );

    return new SearchRelatedAnchorsQueryResponse(searchResults);
  }
}
