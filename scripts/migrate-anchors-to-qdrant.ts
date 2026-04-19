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
  const collections = ['quotes', 'source_ideas', 'anchors'];

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
async function migrateAnchors() {
  console.log('Starting migration of anchors to Qdrant...');

  try {
    await connectToDatabase();

    await initializeEmbeddingPipeline();

    await ensureCollectionsExist();

    console.log('Migrating anchors...');
    const anchorsQuery = `
      SELECT 
        id, 
        content, 
        category,
        created_at
      FROM anchors
      ORDER BY created_at ASC
    `;

    const anchorsResult = await pool.query(anchorsQuery);

    for (const anchor of anchorsResult.rows) {
      try {
        // Generate embedding for anchor text
        const embedding = await generateProductionEmbedding(anchor.content);

        // Store in Qdrant with metadata
        await upsertToQdrant('anchors', anchor.id, embedding, {
          text: anchor.content,
          category: anchor.category,
          content: anchor.content,
          createdAt: anchor.created_at.toISOString(),
          type: 'anchor',
        });

        console.log(`Migrated anchor: ${anchor.id}`);
      } catch (error) {
        console.error(`Error migrating anchor ${anchor.id}:`, error);
      }
    }

    console.log('Anchor migration completed successfully!');
  } catch (error) {
    console.error('Anchor migration failed:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('Database connection closed');
    }
  }
}

// Run the migration
migrateAnchors().catch((error) => {
  console.error('Anchor migration script failed:', error);
  process.exit(1);
});
