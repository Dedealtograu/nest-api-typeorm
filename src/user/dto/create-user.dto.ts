import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { Role } from '../../enums/role.enums'

export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsDateString()
  birthAt?: Date

  @IsOptional()
  @IsEnum(Role)
  role?: number

  @IsStrongPassword({
    minLength: 6,
  })
  password: string
}
