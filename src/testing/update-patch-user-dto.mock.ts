import { Role } from '../enums/role.enums'
import { UpdatePatchUserDto } from '../user/dto/update-patch-user.dto'

export const updatePatchUserDtoMock: UpdatePatchUserDto = {
  role: Role.Admin,
}
