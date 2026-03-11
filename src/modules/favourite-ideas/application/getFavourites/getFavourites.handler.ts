import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFavouritesQuery } from './getFavourites.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetFavouritesQuery)
export class GetFavouritesHandler implements IQueryHandler<GetFavouritesQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(_query: GetFavouritesQuery) {
    return this.dbContext.favouriteIdea.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
