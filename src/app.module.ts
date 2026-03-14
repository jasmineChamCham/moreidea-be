import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GeminiModule } from './modules/gemini/gemini.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { SourcesModule } from './modules/sources/sources.module';
import { SourceIdeasModule } from './modules/source-ideas/source-ideas.module';
import { TopicsModule } from './modules/topics/topics.module';
import { MentorQuotesModule } from './modules/mentor-quotes/mentor-quotes.module';
import { QuotesModule } from './modules/quotes/quotes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    GeminiModule,
    MentorsModule,
    SourcesModule,
    SourceIdeasModule,
    TopicsModule,
    MentorQuotesModule,
    QuotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
