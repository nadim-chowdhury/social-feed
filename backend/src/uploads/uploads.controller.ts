import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import type { UploadSignatureResponse } from './interfaces/upload-signature-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @Post('signature')
  getSignature(@CurrentUser() user: User): UploadSignatureResponse {
    return this.uploadService.generateSignature(user.id);
  }
}
