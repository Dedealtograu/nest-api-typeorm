import { JwtService } from '@nestjs/jwt'
import { accessToken } from './access-token.mock'
import { jwtPayload } from './jwt-payload.mock'

export const jwtServiceyMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue(accessToken),
    verify: jest.fn().mockReturnValue(jwtPayload),
  },
}
