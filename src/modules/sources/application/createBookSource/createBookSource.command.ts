export class CreateBookSourceCommand {
  constructor(
    public readonly fileBuffer: Buffer,
    public readonly originalFileName: string,
    public readonly mentorId?: string,
    public readonly creator?: string,
  ) {}
}
