import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import env from '../../utils/env.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';

const s3Config: S3ClientConfig = {
  region: 'auto',
  endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
};

export default class S3Service {
  private static _s3 = new S3Client(s3Config);
  private static _bucket = env.S3_BUCKET;

  private static getFileType = (mime: string) => {
    return mime.split('/')[1];
  };

  public static getObject(key: string) {
    return this._s3.send(
      new GetObjectCommand({
        Bucket: this._bucket,
        Key: key,
      }),
    );
  }

  public static download(key: string, expiresIn: number = 3600) {
    return getSignedUrl(this._s3, new GetObjectCommand({ Bucket: this._bucket, Key: key }), {
      expiresIn,
    });
  }

  public static async uploadFile(file: MultipartFile) {
    const fileType = this.getFileType(file.mimetype);
    const fileNameGen = `${randomUUID()}.${fileType}`;
    return new Upload({
      client: this._s3,
      params: {
        Bucket: this._bucket,
        Key: fileNameGen,
        Body: await file.toBuffer(),
        
      },
    }).done();
  }
}
