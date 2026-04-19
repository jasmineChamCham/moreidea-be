import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GeminiModule } from './modules/gemini/gemini.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { SourcesModule } from './modules/sources/sources.module';
import { SourceIdeasModule } from './modules/source-ideas/source-ideas.module';
import { TopicsModule } from './modules/topics/topics.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { SemanticSearchModule } from './modules/semantic-search/semantic-search.module';
import { QdrantModule } from './modules/qdrant/qdrant.module';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module';
import { ContentsModule } from './modules/contents/contents.module';
import { AnchorsModule } from './modules/anchors/anchors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnchorsModule,
    PassportModule,
    GeminiModule,
    MentorsModule,
    SourcesModule,
    SourceIdeasModule,
    TopicsModule,
    QuotesModule,
    SemanticSearchModule,
    QdrantModule,
    EmbeddingsModule,
    ContentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
