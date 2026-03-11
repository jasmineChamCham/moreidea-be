export class CreateBookSourceCommand {
  constructor(
    public readonly fileBuffer: Buffer,
    public readonly originalFileName: string,
  ) {}
}
