import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetSourceDetailsQuery } from './getSourceDetails.query';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class GetSourceDetailsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get source details with idea count' })
  @ApiParam({ name: 'id', description: 'Source ID' })
  @Get(':id')
  public async get(@Param('id') id: string) {
    try {
      return await this.queryBus.execute(new GetSourceDetailsQuery(id));
    } catch (error) {
      if (error.message === 'Source not found') {
        throw new NotFoundException('Source not found');
      }
      throw error;
    }
  }
}
