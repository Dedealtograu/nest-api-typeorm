import { UserService } from '../user/user.service'
import { userEntityListMock } from './user-entity-list.mock'

export const userServiceMock = {
  provide: UserService,
  useValue: {
    create: jest.fn().mockResolvedValue(userEntityListMock[0]),
    list: jest.fn().mockResolvedValue(userEntityListMock),
    findById: jest.fn().mockResolvedValue(userEntityListMock[0]),
    update: jest.fn().mockResolvedValue(userEntityListMock[0]),
    updatePartial: jest.fn().mockResolvedValue(userEntityListMock[0]),
    delete: jest.fn().mockResolvedValue(true),
    exist: jest.fn().mockResolvedValue(true),
  },
}
