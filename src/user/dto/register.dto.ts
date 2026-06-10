import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone must be valid number',
  })
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;
}
