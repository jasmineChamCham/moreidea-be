import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => 'media/sessions',

    // Check if we can change filename or keep original
    public_id: (req, file) => {
      const filename = file.originalname.split('.').slice(0, -1).join('.');
      return filename + '-' + Date.now();
    },
    resource_type: 'auto',
  } as any,
});
