import { IQuery } from '@nestjs/cqrs';
import { Anchor } from '@prisma/client';

export class GetAnchorsQuery implements IQuery {
  readonly: void;
}

export class GetAnchorsQueryResponse {
  constructor(public readonly anchors: Anchor[]) {}
}
