import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetMentorDetailsQuery } from './getMentorDetails.query';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class GetMentorDetailsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get mentor details with topics, quotes, and sources' })
  @ApiParam({ name: 'id', description: 'Mentor ID' })
  @Get(':id/details')
  public async get(@Param('id') id: string) {
    try {
      return await this.queryBus.execute(new GetMentorDetailsQuery(id));
    } catch (error) {
      if (error.message === 'Mentor not found') {
        throw new NotFoundException('Mentor not found');
      }
      throw error;
    }
  }
}
