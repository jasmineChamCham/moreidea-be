import { IQuery } from '@nestjs/cqrs';

export class SearchRelatedAnchorsQuery implements IQuery {
  constructor(
    public readonly searchText: string,
  ) {}
}

export class SearchRelatedAnchorsQueryResponse {
  constructor(public readonly relatedAnchors: any[]) {}
}
