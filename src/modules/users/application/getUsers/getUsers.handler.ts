import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { GetUsersQuery } from './getUsers.query';
import { GetUsersRequestQuery } from './getUsers.request-query';
import { GetUsersQueryResponse, GetUsersResponse } from './getUsers.response';
import { filterString } from 'src/common/utils/string';
import { PrismaService } from 'src/database';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({ query }: GetUsersQuery): Promise<GetUsersQueryResponse> {
    const { perPage, page } = query;

    const { total, users } = await this.getUsers(query);

    const response = {
      meta: {
        page,
        perPage,
        total,
      },
      data: users
    };

    return response as GetUsersQueryResponse;
  }

  private async getUsers(options: GetUsersRequestQuery) {
    const { search, roleTypes, page, perPage, order } = options;

    const andWhereConditions: Prisma.Enumerable<Prisma.UserWhereInput> = [];

    if (search) {
      andWhereConditions.push({
        OR: [
          {
            displayName: filterString(search),
          },
          {
            email: filterString(search),
          }
        ],
      });
    }

    if (roleTypes?.length) {
      andWhereConditions.push({
        role: {
          in: roleTypes,
        }
      });
    }

    const [total, users] = await Promise.all([
      this.dbContext.user.count({
        where: {
          AND: andWhereConditions,
        },
      }),
      this.dbContext.user.findMany({
        where: {
          AND: andWhereConditions,
        },
        select: {
          id: true,
          displayName: true,
          email: true,
          mbti: true,
          loveLanguages: true,
          role: true,
          createdAt: true,
        },
        orderBy: this.getOrderBy(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, users };
  }

  private getOrderBy(order?: string): { [key: string]: string } {
    if (!order) {
      return {
        createdAt: Prisma.SortOrder.desc,
      };
    }
    const [field, direction] = order.split(':');

    return { [field]: direction };
  }
}
