import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchRelevantContentQuery } from './searchRelevantContent.query';
import { QdrantService } from '../../../qdrant/qdrant.service';
import { PrismaService } from 'src/database';
import { pipeline, env } from '@xenova/transformers';
import { EMBEDDING_MODEL } from 'src/common/constants';
import { SearchContentType } from 'src/common/enum';

// Disable local model downloads
env.allowLocalModels = false;

@QueryHandler(SearchRelevantContentQuery)
export class SearchRelevantContentHandler implements IQueryHandler<SearchRelevantContentQuery> {
  private embeddingPipeline: any = null;

  constructor(
    private readonly qdrantService: QdrantService
  ) { }

  private async getEmbeddingPipeline(): Promise<any> {
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL);
    }
    return this.embeddingPipeline;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const pipeline = await this.getEmbeddingPipeline();
    const result = await pipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  public async execute(query: SearchRelevantContentQuery) {
    const { query: searchQuery, limit } = query;

    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(searchQuery);

    // Search for similar quotes using Qdrant
    const quoteResults = await this.qdrantService.searchQuotes(queryEmbedding, limit);

    // Search for similar source ideas using Qdrant
    const sourceIdeaResults = await this.qdrantService.searchSourceIdeas(queryEmbedding, limit);

    // Process quote results
    const quotes = quoteResults.map(result => ({
      id: result.id,
      quote: result.payload.quote,
      photoUrl: result.payload.photoUrl,
      createdAt: result.payload.createdAt,
      mentorName: result.payload.mentorName,
      style: result.payload.style,
      speakingStyle: result.payload.speakingStyle,
      bodyLanguage: result.payload.bodyLanguage,
      similarity: result.score,
      type: SearchContentType.QUOTE
    }));

    // Process source idea results
    const sourceIdeas = sourceIdeaResults.map(result => ({
      id: result.id,
      ideaText: result.payload.text,
      sourceUrl: result.payload.sourceUrl,
      core: result.payload.core,
      importance: result.payload.importance,
      application: result.payload.application,
      example: result.payload.example,
      createdAt: result.payload.createdAt,
      mentorName: result.payload.mentorName,
      style: result.payload.style,
      speakingStyle: result.payload.speakingStyle,
      bodyLanguage: result.payload.bodyLanguage,
      sourceTitle: result.payload.sourceTitle,
      sourceType: result.payload.sourceType,
      similarity: result.score,
      type: SearchContentType.SOURCE_IDEA
    }));

    // Combine and sort results
    const combinedResults = [...quotes, ...sourceIdeas]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return combinedResults;
  }
}
