import { CreateUserDto } from '../user/dto/create-user.dto'
import { Role } from '../enums/role.enums'

export const createUserDtoMock: CreateUserDto = {
  birthAt: new Date(),
  email: 'bVXhU@example.com',
  name: 'John Doe',
  password: '123456',
  role: Role.User,
}
