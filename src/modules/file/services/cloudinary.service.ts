// cloudinary.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  /**
   * Upload a file to Cloudinary
   * @param file - The file to upload
   * @param folder - Optional folder path in Cloudinary (e.g., 'media/session-123' or 'avatars/user-456')
   * @returns Upload result with secure_url
   */
  uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadOptions: any = {
        filename_override: file.originalname,
      };

      // Add folder path if provided
      if (folder) {
        uploadOptions.folder = folder;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Delete a file from Cloudinary using its URL
   * @param url - The Cloudinary URL (e.g., https://res.cloudinary.com/.../image.jpg)
   * @returns Promise indicating deletion success
   */
  async deleteFileByUrl(url: string): Promise<void> {
    if (!url) {
      this.logger.warn('Attempted to delete file with empty URL');
      return;
    }

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) {
      this.logger.warn(`URL is not from Cloudinary: ${url}`);
      return;
    }

    try {
      // Extract public_id from Cloudinary URL
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
      // public_id would be: folder/image
      const publicId = this.extractPublicIdFromUrl(url);

      if (!publicId) {
        this.logger.warn(`Could not extract public_id from URL: ${url}`);
        return;
      }

      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Successfully deleted file from Cloudinary: ${publicId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete file from Cloudinary: ${error.message}`,
        error.stack,
      );
      // Don't throw error - deletion failure shouldn't block avatar update
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns public_id or null
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Remove query parameters if any
      const urlWithoutParams = url.split('?')[0];

      // Split by '/' and find the 'upload' segment
      const parts = urlWithoutParams.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');

      if (uploadIndex === -1) {
        return null;
      }

      // Skip version (v1234567890) if present
      let startIndex = uploadIndex + 1;
      if (parts[startIndex] && parts[startIndex].startsWith('v')) {
        startIndex++;
      }

      // Get all parts from startIndex to the end
      const pathParts = parts.slice(startIndex);

      // Remove file extension from the last part
      const lastPart = pathParts[pathParts.length - 1];
      const lastPartWithoutExt =
        lastPart.substring(0, lastPart.lastIndexOf('.')) || lastPart;
      pathParts[pathParts.length - 1] = lastPartWithoutExt;

      return pathParts.join('/');
    } catch (error) {
      this.logger.error(`Error extracting public_id: ${error.message}`);
      return null;
    }
  }
}
