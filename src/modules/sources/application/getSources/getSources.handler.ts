import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSourcesQuery } from './getSources.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetSourcesQuery)
export class GetSourcesHandler implements IQueryHandler<GetSourcesQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(_query: GetSourcesQuery) {
    return this.dbContext.bookVideoSource.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { ideas: true } } },
    });
  }
}
