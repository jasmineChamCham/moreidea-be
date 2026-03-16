export class SearchEmbeddingsQuery {
  constructor(
    public readonly queryEmbedding: number[],
    public readonly limit: number = 10,
  ) { }
}
