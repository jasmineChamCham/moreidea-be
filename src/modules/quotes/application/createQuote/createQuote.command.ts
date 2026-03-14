export class CreateQuoteCommand {
  constructor(
    public readonly mentorId: string,
    public readonly quote: string,
    public readonly place?: string,
    public readonly photoUrl?: string,
  ) { }
}
