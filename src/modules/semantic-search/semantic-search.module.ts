import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database';
import { QdrantModule } from '../qdrant/qdrant.module';
import * as useCases from './application';

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter(
  (x) => x.name.endsWith('Handler') || x.name.endsWith('QueryHandler'),
);

@Module({
  imports: [CqrsModule, DatabaseModule, QdrantModule],
  controllers: [...endpoints],
  providers: [...handlers],
})
export class SemanticSearchModule { }
