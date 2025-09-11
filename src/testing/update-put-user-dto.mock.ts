import { Role } from '../enums/role.enums'
import { UpdatePutUserDto } from '../user/dto/update-put-user.dto'

export const updatePutUserDtoMock: UpdatePutUserDto = {
  birthAt: new Date(),
  email: 'bVXhU@example.com',
  name: 'John Doe',
  password: '123456',
  role: Role.User,
}
