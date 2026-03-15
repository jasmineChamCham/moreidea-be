import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchRelevantContentQuery } from './searchRelevantContent.query';
import { PrismaService } from 'src/database';
import { pipeline, env } from '@xenova/transformers';

// Disable local model downloads
env.allowLocalModels = false;

@QueryHandler(SearchRelevantContentQuery)
export class SearchRelevantContentHandler implements IQueryHandler<SearchRelevantContentQuery> {
  private embeddingPipeline: any = null;
  private readonly modelName = 'Xenova/all-MiniLM-L6-v2';

  constructor(private readonly dbContext: PrismaService) { }

  private async getEmbeddingPipeline(): Promise<any> {
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await pipeline('feature-extraction', this.modelName);
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

    // Search for similar quotes
    const quotes = await this.dbContext.$queryRaw`
      SELECT 
        q.id,
        q.quote,
        q.photo_url as "photoUrl",
        q.created_at as "createdAt",
        m.name as "mentorName",
        m.style,
        m."speakingStyle" as "speakingStyle",
        m."bodyLanguage" as "bodyLanguage",
        1 - (q.embedding <=> ${queryEmbedding}) as similarity
      FROM quotes q
      JOIN mentors m ON q.mentor_id = m.id
      WHERE q.embedding IS NOT NULL
      ORDER BY q.embedding <=> ${queryEmbedding}
      LIMIT ${limit}
    ` as any[];

    // Search for similar source ideas
    const sourceIdeas = await this.dbContext.$queryRaw`
      SELECT 
        si.id,
        si.idea_text as "ideaText",
        si.core,
        si.importance,
        si.created_at as "createdAt",
        m.name as "mentorName",
        m.style,
        m."speakingStyle" as "speakingStyle",
        m."bodyLanguage" as "bodyLanguage",
        bvs.source_title as "sourceTitle",
        bvs.source_type as "sourceType",
        1 - (si.embedding <=> ${queryEmbedding}) as similarity
      FROM source_ideas si
      JOIN book_video_sources bvs ON si.source_id = bvs.id
      LEFT JOIN mentors m ON bvs.mentor_id = m.id
      WHERE si.embedding IS NOT NULL
      ORDER BY si.embedding <=> ${queryEmbedding}
      LIMIT ${limit}
    ` as any[];

    // Combine and sort results
    const combinedResults = [
      ...quotes.map((q: any) => ({ ...q, type: 'quote' })),
      ...sourceIdeas.map((si: any) => ({ ...si, type: 'sourceIdea' })),
    ]
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, limit);

    return combinedResults;
  }
}
