import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContentsQuery } from './getContents.query';
import { PrismaService } from 'src/database';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@QueryHandler(GetContentsQuery)
export class GetContentsHandler implements IQueryHandler<GetContentsQuery> {
  private readonly logger = new Logger(GetContentsHandler.name);

  constructor(private readonly dbContext: PrismaService) { }

  public async execute() {
    this.logger.log('Fetching all contents');
    const contents = await this.dbContext.content.findMany({
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    return contents;
  }
}
