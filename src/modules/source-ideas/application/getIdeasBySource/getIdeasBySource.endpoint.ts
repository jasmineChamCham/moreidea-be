import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetIdeasBySourceQuery } from './getIdeasBySource.query';

@ApiTags('Source Ideas')
@Controller({ path: 'sources/:sourceId/ideas', version: '1' })
export class GetIdeasBySourceEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all ideas for a specific source' })
  @Get()
  public get(@Param('sourceId') sourceId: string) {
    return this.queryBus.execute(new GetIdeasBySourceQuery(sourceId));
  }
}
