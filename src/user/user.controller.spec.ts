import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { userServiceMock } from '../testing/user-service.mock'
import { AuthGuard } from '../guards/auth.guard'
import { guardMock } from '../testing/guard.mock'
import { RoleGuard } from '../guards/role.guard'
import { UserService } from './user.service'
import { createUserDtoMock } from '../testing/create-user-dto.mock'
import { userEntityListMock } from '../testing/user-entity-list.mock'
import { updatePutUserDtoMock } from '../testing/update-put-user-dto.mock'
import { updatePatchUserDtoMock } from '../testing/update-patch-user-dto.mock'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile()

    userController = moduleFixture.get<UserController>(UserController)
    userService = moduleFixture.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
    expect(userService).toBeDefined()
  })

  describe('Test Guard', () => {
    it('Guard aplicado ', () => {
      const guards = Reflect.getMetadata('__guards__', UserController) as Array<new (...args: any[]) => any>
      expect(guards).toHaveLength(2)
      expect(new guards[0]()).toBeInstanceOf(AuthGuard)
      expect(new guards[1]()).toBeInstanceOf(RoleGuard)
    })
  })

  describe('create', () => {
    it('method create', async () => {
      const result = await userController.create(createUserDtoMock)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('list', () => {
    it('method list', async () => {
      const result = await userController.list()
      expect(result).toEqual(userEntityListMock)
    })

    it('method findOne', async () => {
      const result = await userController.findOne(1)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('update', () => {
    it('method update', async () => {
      const result = await userController.update(updatePutUserDtoMock, 1)
      expect(result).toEqual(userEntityListMock[0])
    })

    it('method updatePartial', async () => {
      const result = await userController.updatePartial(updatePatchUserDtoMock, 1)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('delete', () => {
    it('method delete', async () => {
      const result = await userController.delete(1)
      expect(result).toEqual({ success: true })
    })
  })
})
