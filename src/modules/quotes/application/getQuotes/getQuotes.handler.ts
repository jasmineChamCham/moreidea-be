import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetQuotesQuery } from './getQuotes.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetQuotesQuery)
export class GetQuotesHandler implements IQueryHandler<GetQuotesQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(_query: GetQuotesQuery) {
    return this.dbContext.quote.findMany({
      include: {
        mentor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
