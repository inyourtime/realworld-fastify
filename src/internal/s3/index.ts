import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import env from '../../utils/env.util';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Config: S3ClientConfig = {
  region: 'auto',
  endpoint: `https://${env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
};

export default class S3Handler {
  private _s3: S3Client;
  private _bucket: string;

  constructor() {
    this._s3 = new S3Client(s3Config);
    this._bucket = env.S3_BUCKET;
  }

  public async getBucketList() {
    return this._s3.send(new ListBucketsCommand('')).then((result) => result.Buckets);
  }

  public async getObjectsList() {
    return this._s3
      .send(
        new ListObjectsV2Command({
          Bucket: this._bucket,
        }),
      )
      .then((result) => result.Contents);
  }

  public async getObject(key: string) {
    return this._s3.send(
      new GetObjectCommand({
        Bucket: this._bucket,
        Key: key,
      }),
    );
  }

  public async getObjectUrl(key: string) {
    return getSignedUrl(this._s3, new GetObjectCommand({ Bucket: this._bucket, Key: key }), {
      expiresIn: 3600,
    });
  }
}
