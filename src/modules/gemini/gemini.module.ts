import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { GeminiService } from './gemini.service';
import * as useCases from './application';

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter(
  (x) => x.name.endsWith('Handler') || x.name.endsWith('QueryHandler'),
);

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, CqrsModule],
  controllers: [...endpoints],
  providers: [GeminiService, ...handlers],
  exports: [GeminiService],
})
export class GeminiModule {}
