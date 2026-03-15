import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateEmbeddingsCommand } from '../src/modules/semantic-search/application/generateEmbeddings/generateEmbeddings.command';

async function generateEmbeddings() {
  console.log('Starting embedding generation...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const commandBus = app.get(CommandBus);

  try {
    await commandBus.execute(new GenerateEmbeddingsCommand());
    console.log('Embeddings generated successfully!');
  } catch (error) {
    console.error('Error generating embeddings:', error);
  } finally {
    await app.close();
  }
}

generateEmbeddings().catch(console.error);
