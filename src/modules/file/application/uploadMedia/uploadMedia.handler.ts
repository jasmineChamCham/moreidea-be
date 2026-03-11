import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadMediaCommand } from './uploadMedia.command';
import { CloudinaryService } from '../../services';
import { PrismaService } from 'src/database/services/prisma.service';
import { FileType } from '@prisma/client';
import { UploadMediaResponse } from './uploadMedia.response';
import { determineFileType } from 'src/common/utils/file';

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prismaService: PrismaService,
  ) {}

  public async execute({
    files,
    sessionId,
  }: UploadMediaCommand): Promise<UploadMediaResponse[]> {
    const folderPath = `media/session-${sessionId}`;

    const uploadedFiles = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadFile(file, folderPath)),
    );

    const uploadData = uploadedFiles.map((uploadedFile, index) => {
      const file = files[index];
      const fileType = determineFileType(file.mimetype);

      return {
        sessionId,
        filePath: uploadedFile.secure_url,
        fileType,
        fileName: uploadedFile.original_filename || file.originalname,
        orderIndex: index,
      };
    });

    // Bulk insert into database
    const createdUploads = await this.prismaService.$transaction(
      uploadData.map((data) => this.prismaService.upload.create({ data })),
    );

    return createdUploads;
  }
}
