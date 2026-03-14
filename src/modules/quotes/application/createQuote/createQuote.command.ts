export class CreateQuoteCommand {
  constructor(
    public readonly mentorId: string,
    public readonly quote: string,
    public readonly photoUrl?: string,
  ) { }
}
