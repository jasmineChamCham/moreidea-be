import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIdeasBySourceQuery } from './getIdeasBySource.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetIdeasBySourceQuery)
export class GetIdeasBySourceHandler implements IQueryHandler<GetIdeasBySourceQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(query: GetIdeasBySourceQuery) {
    return this.dbContext.sourceIdea.findMany({
      where: { sourceId: query.sourceId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
