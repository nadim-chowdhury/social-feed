import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password: string;
}
