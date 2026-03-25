import { Injectable, Logger } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from 'src/common/constants';

@Injectable()
export class QdrantService {
  private readonly logger = new Logger(QdrantService.name);
  private readonly client: QdrantClient;

  // Collection names for different entity types
  private readonly QUOTES_COLLECTION = 'quotes';
  private readonly SOURCE_IDEAS_COLLECTION = 'source_ideas';

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
    });
  }

  async onModuleInit() {
    await this.initializeCollections();
  }

  private async initializeCollections() {
    try {
      // Initialize quotes collection
      await this.createCollectionIfNotExists(this.QUOTES_COLLECTION);

      // Initialize source ideas collection
      await this.createCollectionIfNotExists(this.SOURCE_IDEAS_COLLECTION);

      this.logger.log('Qdrant collections initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Qdrant collections:', error);
      throw error;
    }
  }

  private async createCollectionIfNotExists(collectionName: string) {
    try {
      await this.client.getCollection(collectionName);
      this.logger.log(`Collection ${collectionName} already exists`);
    } catch (error) {
      if (error.status === 404) {
        await this.client.createCollection(collectionName, {
          vectors: {
            size: EMBEDDING_DIMENSIONS,
            distance: 'Cosine',
          },
        });
        this.logger.log(`Created collection ${collectionName}`);
      } else {
        throw error;
      }
    }
  }

  async upsertQuote(id: string, embedding: number[], metadata: any) {
    await this.client.upsert(this.QUOTES_COLLECTION, {
      points: [
        {
          id,
          vector: embedding,
          payload: metadata,
        },
      ],
    });
  }

  async upsertSourceIdea(id: string, embedding: number[], metadata: any) {
    await this.client.upsert(this.SOURCE_IDEAS_COLLECTION, {
      points: [
        {
          id,
          vector: embedding,
          payload: metadata,
        },
      ],
    });
  }

  async searchQuotes(queryEmbedding: number[], limit: number = 10) {
    const response = await this.client.search(this.QUOTES_COLLECTION, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
    });
    return response;
  }

  async searchSourceIdeas(queryEmbedding: number[], limit: number = 10) {
    const response = await this.client.search(this.SOURCE_IDEAS_COLLECTION, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
    });
    return response;
  }

  async deleteQuote(id: string) {
    await this.client.delete(this.QUOTES_COLLECTION, {
      points: [id],
    });
  }

  async deleteSourceIdea(id: string) {
    await this.client.delete(this.SOURCE_IDEAS_COLLECTION, {
      points: [id],
    });
  }

  getQuotesCollectionName() {
    return this.QUOTES_COLLECTION;
  }

  getSourceIdeasCollectionName() {
    return this.SOURCE_IDEAS_COLLECTION;
  }
}
