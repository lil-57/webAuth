import { IsOptional, IsString, IsEmail, MinLength, IsNotEmpty } from "class-validator"

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @MinLength(8)
  password?: string

  @IsNotEmpty()
  captchaToken: string
}
