import { Pool } from 'pg';
import { pipeline, env } from '@xenova/transformers';
import { config } from 'dotenv';

const MODEL_DIMENSIONS = 768;
const EMBEDDING_MODEL = 'Xenova/bge-base-en-v1.5'; // 768 dimensions

config();

// Disable local model downloads
env.allowLocalModels = false;
const url = new URL(process.env.DIRECT_URL!);

const DB_CONFIG = {
  host: url.hostname,
  port: parseInt(url.port || "5432"),
  database: url.pathname.replace("/", ""),
  user: url.username,
  password: url.password,
};

console.log('Database Config:', {
  ...DB_CONFIG,
  password: DB_CONFIG.password ? '***' : 'undefined'
});

const QDRANT_CONFIG = {
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY || '',
};

// Embedding function using transformers library
async function generateProductionEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingPipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Database connection
let pool: Pool;
let embeddingPipeline: any;

async function initializeEmbeddingPipeline() {
  console.log('Initializing embedding pipeline...');
  embeddingPipeline = await pipeline('feature-extraction', EMBEDDING_MODEL);
  console.log('Embedding pipeline initialized');
}

async function connectToDatabase() {
  pool = new Pool(DB_CONFIG);
  console.log('Connected to database');
}

// Qdrant operations using HTTP requests
async function upsertToQdrant(collection: string, id: string, embedding: number[], metadata: any) {
  const url = `${QDRANT_CONFIG.url}/collections/${collection}/points`;
  const payload = {
    points: [{
      id: id,
      vector: embedding,
      payload: metadata
    }]
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (QDRANT_CONFIG.apiKey) {
    headers['api-key'] = QDRANT_CONFIG.apiKey;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Qdrant request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`Upserted to ${collection}: ${id}`);
  } catch (error) {
    console.error(`Error upserting to ${collection} for ${id}:`, error);
    throw error;
  }
}

// Ensure collections exist
async function ensureCollectionsExist() {
  const collections = ['quotes', 'source_ideas'];

  for (const collectionName of collections) {
    try {
      const url = `${QDRANT_CONFIG.url}/collections/${collectionName}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (QDRANT_CONFIG.apiKey) {
        headers['api-key'] = QDRANT_CONFIG.apiKey;
      }

      const response = await fetch(url, { headers });

      if (response.status === 404) {
        // Create collection
        const createUrl = `${QDRANT_CONFIG.url}/collections/${collectionName}`;
        const createPayload = {
          vectors: {
            size: MODEL_DIMENSIONS,
            distance: 'Cosine'
          }
        };

        const createResponse = await fetch(createUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify(createPayload),
        });

        if (!createResponse.ok) {
          throw new Error(`Failed to create collection ${collectionName}`);
        }

        console.log(`Created collection: ${collectionName}`);
      } else if (!response.ok) {
        throw new Error(`Failed to check collection ${collectionName}`);
      } else {
        console.log(`Collection exists: ${collectionName}`);
      }
    } catch (error) {
      console.error(`Error ensuring collection exists ${collectionName}:`, error);
      throw error;
    }
  }
}

// Main migration function
async function migrateEmbeddings() {
  console.log('Starting migration of embeddings to Qdrant...');

  try {
    await connectToDatabase();

    await initializeEmbeddingPipeline();

    await ensureCollectionsExist();

    console.log('Migrating quotes...');
    const quotesQuery = `
      SELECT 
        id, 
        quote, 
        "mentor_id", 
        "photo_url", 
        "created_at"
      FROM quotes
    `;

    const quotesResult = await pool.query(quotesQuery);

    for (const quote of quotesResult.rows) {
      try {
        // Generate embedding for the quote text
        const embedding = await generateProductionEmbedding(quote.quote);

        // Store in Qdrant with metadata
        await upsertToQdrant('quotes', quote.id, embedding, {
          text: quote.quote,
          mentorId: quote.mentor_id,
          photoUrl: quote.photo_url,
          createdAt: quote.created_at.toISOString(),
          type: 'quote',
        });

        console.log(`Migrated quote: ${quote.id}`);
      } catch (error) {
        console.error(`Error migrating quote ${quote.id}:`, error);
      }
    }

    console.log('Migrating source ideas...');
    const sourceIdeasQuery = `
      SELECT 
        si.id,
        si."idea_text",
        si."source_id",
        si.core,
        si.importance,
        s.source_url,
        si.application,
        si.example,
        si."topic_id",
        si."created_at",
        s."source_title",
        s."source_type",
        m.id as mentorId,
        m.name as mentorName,
        m.style as style,
        m.speaking_style as speakingStyle,
        m.body_language as bodyLanguage,
        s.creator
      FROM "source_ideas" si
      LEFT JOIN "book_video_sources" s ON si."source_id" = s.id
      LEFT JOIN "mentors" m ON s."mentor_id" = m.id
    `;

    const sourceIdeasResult = await pool.query(sourceIdeasQuery);

    for (const sourceIdea of sourceIdeasResult.rows) {
      try {
        // Generate embedding for the idea text
        const text = `Core: ${sourceIdea.core || ''}\nIdea: ${sourceIdea.idea_text}`;
        const embedding = await generateProductionEmbedding(text);

        // Prepare metadata, only include mentor fields if they exist
        const metadata: any = {
          text: sourceIdea.idea_text,
          sourceId: sourceIdea.source_id,
          sourceTitle: sourceIdea.source_title,
          sourceType: sourceIdea.source_type,
          sourceUrl: sourceIdea.source_url,
          creator: sourceIdea.creator,
          core: sourceIdea.core,
          importance: sourceIdea.importance,
          application: sourceIdea.application,
          example: sourceIdea.example,
          topicId: sourceIdea.topic_id,
          createdAt: sourceIdea.created_at.toISOString(),
        };

        // Only add mentor fields if they exist
        if (sourceIdea.mentorid) {
          metadata.mentorId = sourceIdea.mentorid;
          metadata.mentorName = sourceIdea.mentorname;
          metadata.style = sourceIdea.style;
          metadata.speakingStyle = sourceIdea.speakingstyle;
          metadata.bodyLanguage = sourceIdea.bodylanguage;
        }

        console.log({ metadata })

        // Store in Qdrant with metadata
        await upsertToQdrant('source_ideas', sourceIdea.id, embedding, metadata);

        console.log(`Migrated source idea: ${sourceIdea.id}`);
      } catch (error) {
        console.error(`Error migrating source idea ${sourceIdea.id}:`, error);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database connection closed');
    }
  }
}

// Run the migration
migrateEmbeddings().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
