import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { guardMock } from '../testing/guard.mock'
import { AuthGuard } from '../guards/auth.guard'
import { AuthService } from './auth.service'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { jwtServiceyMock } from '../testing/jwt-service.mock'
import { userServiceMock } from '../testing/user-service.mock'
import { mailerServiceyMock } from '../testing/mailer-service.mock'
import { FileService } from '../file/file.service'
import { authLoginDtoMock } from '../testing/auth-login-dto.mock'
import { accessToken } from '../testing/access-token.mock'
import { fileServiceMock } from '../testing/file-service.mock'
import { authServiceMock } from '../testing/auth-service.mock'
import { authRegisterDtoMock } from '../testing/auth-register-dto.mpck'
import { authForgetDtoMock } from '../testing/auth-forget-dto.mock'
import { authResetDtoMock } from '../testing/auth-lreset-dto.mock'
import { userEntityListMock } from '../testing/user-entity-list.mock'
import { getPhotoMock } from '../testing/get-photo.mock'

describe('AuthController', () => {
  let authController: AuthController
  let fileService: FileService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceyMock,
        userServiceMock,
        mailerServiceyMock,
        FileService,
        fileServiceMock,
        authServiceMock,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile()

    authController = moduleFixture.get<AuthController>(AuthController)
    fileService = moduleFixture.get<FileService>(FileService)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
    expect(fileService).toBeDefined()
  })

  describe('Autentication flux', () => {
    it('should login a user', async () => {
      const result = await authController.login(authLoginDtoMock)
      expect(result).toEqual({ accessToken })
    })

    it('should register a user', async () => {
      const result = await authController.register(authRegisterDtoMock)
      expect(result).toEqual({ accessToken })
    })

    it('should forget a user', async () => {
      const result = await authController.forget(authForgetDtoMock)
      expect(result).toEqual({ success: true })
    })

    it('should reset a user', async () => {
      const result = await authController.reset(authResetDtoMock)
      expect(result).toEqual({ accessToken })
    })
  })

  describe('Autentication routes', () => {
    it('should me', () => {
      const result = authController.me(userEntityListMock[0])
      expect(result).toEqual(userEntityListMock[0])
    })

    it('should uploadPhoto', async () => {
      const photo = await getPhotoMock()
      const result = await authController.uploadPhoto(userEntityListMock[0], photo)
      expect(result).toEqual(photo)
    })
  })
})
