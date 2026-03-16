import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QdrantService } from './qdrant.service';
import * as useCases from './application';

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter(
  (x) => x.name.endsWith('Handler') || x.name.endsWith('QueryHandler'),
);

@Module({
  imports: [CqrsModule],
  controllers: [...endpoints],
  providers: [...handlers, QdrantService],
  exports: [QdrantService],
})
export class QdrantModule { }
