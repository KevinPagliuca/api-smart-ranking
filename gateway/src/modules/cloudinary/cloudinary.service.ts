import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

interface IUploadImageResponse extends UploadApiResponse {
  playerId: string;
}

interface IUploadImageRequest {
  file: Express.Multer.File;
  playerId: string;
  photo_id?: string;
}

@Injectable()
export class CloudinaryService {
  async uploadImage({
    file,
    playerId,
    photo_id,
  }: IUploadImageRequest): Promise<
    IUploadImageResponse | UploadApiErrorResponse
  > {
    if (photo_id) await this.deleteImage(photo_id);

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        const resultWithPlayerId = {
          ...result,
          original_filename: file.originalname,
          playerId,
        };
        resolve(resultWithPlayerId);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(photo_id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(photo_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async getImage(photo_id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.explicit(photo_id, { type: 'upload' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
