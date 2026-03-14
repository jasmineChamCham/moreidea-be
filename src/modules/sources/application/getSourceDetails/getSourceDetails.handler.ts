import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSourceDetailsQuery } from './getSourceDetails.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetSourceDetailsQuery)
export class GetSourceDetailsHandler implements IQueryHandler<GetSourceDetailsQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(query: GetSourceDetailsQuery) {
    const source = await this.dbContext.bookVideoSource.findUnique({
      where: { id: query.id },
      include: {
        _count: {
          select: {
            ideas: true
          }
        }
      }
    });

    if (!source) {
      throw new Error('Source not found');
    }

    return source;
  }
}
