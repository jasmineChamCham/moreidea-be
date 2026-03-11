import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
