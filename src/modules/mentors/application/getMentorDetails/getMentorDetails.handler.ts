import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMentorDetailsQuery } from './getMentorDetails.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetMentorDetailsQuery)
export class GetMentorDetailsHandler implements IQueryHandler<GetMentorDetailsQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(query: GetMentorDetailsQuery) {
    const mentor = await this.dbContext.mentor.findUnique({
      where: { id: query.id },
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        sources: {
          include: {
            _count: {
              select: {
                ideas: true
              }
            }
          }
        },
        quotes: true
      }
    });

    if (!mentor) {
      throw new Error('Mentor not found');
    }

    return {
      ...mentor,
      topics: mentor.topics.map(mt => mt.topic),
      quotes: mentor.quotes,
      sources: mentor.sources
    };
  }
}
