import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTopicsQuery } from './getTopics.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetTopicsQuery)
export class GetTopicsHandler implements IQueryHandler<GetTopicsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(_query: GetTopicsQuery) {
    return this.dbContext.topic.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
