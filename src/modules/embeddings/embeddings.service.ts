import { Injectable, Logger } from '@nestjs/common';
import { pipeline, env } from '@xenova/transformers';
import { EMBEDDING_MODEL } from 'src/common/constants';

// Disable local model downloads
env.allowLocalModels = false;

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private embeddingPipeline: any = null;

  private async getEmbeddingPipeline(): Promise<any> {
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL);
    }
    return this.embeddingPipeline;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const pipeline = await this.getEmbeddingPipeline();
      const result = await pipeline(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    } catch (error) {
      this.logger.error(`Error generating embedding for text: ${text.substring(0, 50)}...`, error);
      throw error;
    }
  }
}
