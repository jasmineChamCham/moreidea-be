import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMentorQuotesQuery } from './getMentorQuotes.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetMentorQuotesQuery)
export class GetMentorQuotesHandler implements IQueryHandler<GetMentorQuotesQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(query: GetMentorQuotesQuery) {
    const { mentorId } = query;
    return this.dbContext.mentorQuote.findMany({
      where: { mentorId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
