export class SearchRelevantContentQuery {
  constructor(
    public readonly query: string,
    public readonly limit: number = 100
  ) {}
}
