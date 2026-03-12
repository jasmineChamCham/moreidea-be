import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { GetMentorQuotesQuery } from './getMentorQuotes.query';

@ApiTags('Mentor Quotes')
@Controller({ path: 'mentors/:mentorId/quotes', version: '1' })
export class GetMentorQuotesEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all quotes for a mentor' })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @Get()
  public get(@Param('mentorId') mentorId: string) {
    return this.queryBus.execute(new GetMentorQuotesQuery(mentorId));
  }
}
