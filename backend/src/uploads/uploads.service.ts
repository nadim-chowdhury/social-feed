import { Injectable } from '@nestjs/common';
import { UploadSignatureResponse } from './interfaces/upload-signature-response.interface';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!;
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')!;
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
    });
  }

  generateSignature(userId: string): UploadSignatureResponse {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `social-feed/${userId}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      this.apiSecret,
    );

    return {
      signature,
      timestamp,
      folder,
      cloudName: this.cloudName,
      apiKey: this.apiKey,
    };
  }
}
