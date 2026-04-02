import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
