import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PostVisibility } from '../enums/post-visibility.enum';

export class CreatePostDto {
  @ValidateIf((dto) => !dto.imageUrl)
  @IsString()
  @MaxLength(5000)
  content?: string | null;

  @ValidateIf((dto) => !dto.content)
  @IsUrl()
  imageUrl?: string | null;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}
