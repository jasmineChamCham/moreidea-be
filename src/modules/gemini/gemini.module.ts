import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
