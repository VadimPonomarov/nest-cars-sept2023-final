import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';
import { ContentType } from '../../common/enums/s3.enum';

@Injectable()
export class FileStorageService {
  private client: S3Client;
  private awsConfig: ConfigType['aws'] =
    configService.get<ConfigType['aws']>('aws');
  private logger: Logger = new Logger();

  constructor() {
    const params: S3ClientConfig = {
      region: this.awsConfig.AWS_S3_BUCKET_REGION,
      credentials: {
        accessKeyId: this.awsConfig.AWS_S3_ACCESS_KEY,
        secretAccessKey: this.awsConfig.AWS_S3_SECRET_KEY,
      },
    };
    if (this.awsConfig.AWS_S3_BUCKET_ENDPOINT) {
      params.forcePathStyle = true;
      params.endpoint = this.awsConfig.AWS_S3_BUCKET_ENDPOINT;
    }

    this.client = new S3Client(params);
  }

  public async uploadFile(
    file: Express.Multer.File,
    itemType: ContentType,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = await this.buildPath(
        itemType,
        itemId,
        file.originalname,
      );
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.AWS_S3_BUCKET_NAME,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
      return filePath;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.AWS_S3_BUCKET_NAME,
          Key: filePath,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async buildPath(
    itemType: ContentType,
    itemId: string,
    fileName: string,
  ): Promise<string> {
    return `${itemType}/${itemId}/${v4()}${path.extname(fileName)}`; // use only  template string
  }
}
