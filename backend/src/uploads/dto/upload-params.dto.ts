import { IsEnum, IsOptional } from 'class-validator';
import { UploadResourceType } from '../enums/upload-resource-type.enum';

export class UploadParamsDto {
  @IsOptional()
  @IsEnum(UploadResourceType)
  resourceType?: UploadResourceType;
}
