import { SearchContentType } from "src/common/enum";

export class UpsertEmbeddingCommand {
  constructor(
    public readonly id: string,
    public readonly embedding: number[],
    public readonly metadata: any,
    public readonly type: SearchContentType,
  ) { }
}
