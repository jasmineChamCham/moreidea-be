export class UpdateQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly quote?: string,
    public readonly photoUrl?: string,
  ) { }
}
