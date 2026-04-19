import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAnchorsQuery, GetAnchorsQueryResponse } from './getAnchors.query';
import { Anchor } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class GetAnchorsHandler implements IQueryHandler<GetAnchorsQuery, GetAnchorsQueryResponse> {
  constructor(private readonly prisma: PrismaClient) { }

  async execute(query: GetAnchorsQuery): Promise<GetAnchorsQueryResponse> {
    const anchors = await this.prisma.anchor.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return new GetAnchorsQueryResponse(anchors);
  }
}
