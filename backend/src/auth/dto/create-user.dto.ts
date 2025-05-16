import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

    @IsNotEmpty()
  captchaToken: string
}
