import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMentorsQuery } from './getMentors.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetMentorsQuery)
export class GetMentorsHandler implements IQueryHandler<GetMentorsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(_query: GetMentorsQuery) {
    return this.dbContext.mentor.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
