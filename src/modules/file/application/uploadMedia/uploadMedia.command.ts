export class UploadMediaCommand {
  constructor(
    public readonly files: Express.Multer.File[],
    public readonly sessionId: string,
  ) {}
}
