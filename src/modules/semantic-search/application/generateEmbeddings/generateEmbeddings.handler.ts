import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { GenerateEmbeddingsCommand } from './generateEmbeddings.command';
import { PrismaService } from 'src/database';
import { pipeline, env } from '@xenova/transformers';

// Disable local model downloads
env.allowLocalModels = false;

@CommandHandler(GenerateEmbeddingsCommand)
export class GenerateEmbeddingsHandler implements ICommandHandler<GenerateEmbeddingsCommand> {
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

  public async execute(command: GenerateEmbeddingsCommand) {
    // Generate embeddings for quotes without embeddings
    const quotes = await this.dbContext.$queryRaw`
      SELECT id, quote FROM quotes 
      WHERE embedding IS NULL OR array_length(embedding, 1) IS NULL
    ` as any[];

    for (const quote of quotes) {
      try {
        const embedding = await this.generateEmbedding(quote.quote);
        await this.dbContext.$queryRaw`
          UPDATE quotes 
          SET embedding = ${embedding}
          WHERE id = ${quote.id}
        `;
        console.log(`Generated embedding for quote: ${quote.id}`);
      } catch (error) {
        console.error(`Error generating embedding for quote ${quote.id}:`, error);
      }
    }

    // Generate embeddings for source ideas without embeddings
    const sourceIdeas = await this.dbContext.$queryRaw`
      SELECT id, idea_text FROM source_ideas 
      WHERE embedding IS NULL OR array_length(embedding, 1) IS NULL
    ` as any[];

    for (const sourceIdea of sourceIdeas) {
      try {
        const text = sourceIdea.idea_text;
        const embedding = await this.generateEmbedding(text);
        await this.dbContext.$queryRaw`
          UPDATE source_ideas 
          SET embedding = ${embedding}
          WHERE id = ${sourceIdea.id}
        `;
        console.log(`Generated embedding for source idea: ${sourceIdea.id}`);
      } catch (error) {
        console.error(`Error generating embedding for source idea ${sourceIdea.id}:`, error);
      }
    }

    return { message: 'Embeddings generated successfully' };
  }
}
