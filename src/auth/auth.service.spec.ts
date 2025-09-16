import { accessToken } from '../testing/access-token.mock'
import { authRegisterDtoMock } from '../testing/auth-register-dto.mpck'
import { jwtPayload } from '../testing/jwt-payload.mock'
import { jwtServiceyMock } from '../testing/jwt-service.mock'
import { mailerServiceyMock } from '../testing/mailer-service.mock'
import { userEntityListMock } from '../testing/user-entity-list.mock'
import { userRepositoryMock } from '../testing/user-repository.mock'
import { userServiceMock } from '../testing/user-service.mock'
import { AuthService } from './auth.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('AuthService', () => {
  let authService: AuthService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [AuthService, userRepositoryMock, jwtServiceyMock, userServiceMock, mailerServiceyMock],
    }).compile()

    authService = moduleFixture.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('Token', () => {
    it('should create a token', () => {
      const result = authService.createToken(userEntityListMock[0])
      expect(result).toEqual({ accessToken })
    })

    it('should check a token', () => {
      // eslint-disable-next-line
      const result = authService.checkToken(accessToken)
      expect(result).toEqual(jwtPayload)
    })

    it('should validate a token', () => {
      const result = authService.isValidToken(accessToken)
      expect(result).toEqual(true)
    })
  })

  describe('Autentication', () => {
    it('should login a user', async () => {
      const result = await authService.login('bVXhU@example.com', '@123Ff')
      expect(result).toEqual({ accessToken })
    })

    it('should forget a user', async () => {
      const result = await authService.forget('bVXhU@example.com')
      expect(result).toEqual({ success: true })
    })

    it('should reset a user', async () => {
      const result = await authService.reset('@123Ff', accessToken)
      expect(result).toEqual({ accessToken })
    })

    it('should register a user', async () => {
      const result = await authService.register(authRegisterDtoMock)
      expect(result).toEqual({ accessToken })
    })
  })
})
