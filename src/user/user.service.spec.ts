import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { createUserDtoMock } from '../testing/create-user-dto.mock'
import { userEntityListMock } from '../testing/user-entity-list.mock'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { updatePutUserDtoMock } from '../testing/update-put-user-dto.mock'
import { updatePatchUserDtoMock } from '../testing/update-patch-user-dto.mock'

describe('UserService', () => {
  let userService: UserService
  let userRepository: Repository<UserEntity>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile()
    userService = moduleFixture.get<UserService>(UserService)
    userRepository = moduleFixture.get(getRepositoryToken(UserEntity))
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('create', () => {
    it('method create', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false)
      const result = await userService.create(createUserDtoMock)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('list', () => {
    it('method list', async () => {
      const result = await userService.list()
      expect(result).toEqual(userEntityListMock)
    })
    describe('findById', () => {
      it('method findById', async () => {
        const result = await userService.findById(1)
        expect(result).toEqual(userEntityListMock[0])
      })
    })
  })

  describe('update', () => {
    it('method update', async () => {
      const result = await userService.update(1, updatePutUserDtoMock)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('updatePartial', () => {
    it('method updatePartial', async () => {
      const result = await userService.updatePartial(1, updatePatchUserDtoMock)
      expect(result).toEqual(userEntityListMock[0])
    })
  })

  describe('delete', () => {
    it('method delete', async () => {
      const result = await userService.delete(1)
      expect(result).toEqual(true)
    })
  })
})
