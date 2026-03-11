import { FileType } from '@prisma/client';

export function determineFileType(mimetype: string): FileType {
  if (mimetype.startsWith('image/')) {
    return FileType.image;
  } else if (mimetype.startsWith('video/')) {
    return FileType.video;
  }
  // Default to image if type cannot be determined
  return FileType.image;
}

export function getFileTypeFromExtension(fileExtension: string): FileType {
  const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm'];
  return VIDEO_EXTENSIONS.includes(fileExtension.toLowerCase())
    ? FileType.video
    : FileType.image;
}

export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}
