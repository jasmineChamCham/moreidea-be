import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/users';
import { FavouriteIdeasModule } from './modules/favourite-ideas/favourite-ideas.module';
import { GeminiModule } from './modules/gemini/gemini.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { SourcesModule } from './modules/sources/sources.module';
import { SourceIdeasModule } from './modules/source-ideas/source-ideas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    UserModule,
    FavouriteIdeasModule,
    GeminiModule,
    MentorsModule,
    SourcesModule,
    SourceIdeasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
