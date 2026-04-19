import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAnchorsQuery, GetAnchorsQueryResponse } from './getAnchors.query';
import { PrismaService } from 'src/database';

@QueryHandler(GetAnchorsQuery)
export class GetAnchorsHandler implements IQueryHandler<GetAnchorsQuery, GetAnchorsQueryResponse> {
  constructor(private readonly prisma: PrismaService) { }

  async execute(query: GetAnchorsQuery): Promise<GetAnchorsQueryResponse> {
    const anchors = await this.prisma.anchor.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return new GetAnchorsQueryResponse(anchors);
  }
}
