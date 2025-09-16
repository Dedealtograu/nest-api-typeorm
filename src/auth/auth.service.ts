import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { AuthRegisterDto } from './dto/auth-register.dto'
import * as bcrypt from 'bcrypt'
import { MailerService } from '@nestjs-modules/mailer/dist'
import { UserEntity } from '../user/entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        { id: user.id, name: user.name, email: user.email },
        { expiresIn: '7d', subject: String(user.id), issuer: 'login', audience: 'users' },
      ),
    }
  }

  checkToken(token: string) {
    try {
      // eslint-disable-next-line
      const data = this.jwtService.verify(token, {issuer: 'login', audience: 'users' })
      // eslint-disable-next-line
      return data
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch {
      return false
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.createToken(user)
  }

  async forget(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Email not found')
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    )
    await this.mailer.sendMail({
      to: 'dede@email.com',
      subject: 'Redefinição de senha',
      template: 'forget',
      context: {
        name: '',
        token,
      },
    })

    return { success: true }
  }

  async reset(password: string, token: string) {
    try {
      const data = this.jwtService.verify<{
        id: number | string
      }>(token, { issuer: 'forget', audience: 'users' })

      if (isNaN(Number(data.id))) {
        throw new UnauthorizedException('Invalid token')
      }

      password = await bcrypt.hash(password, 10)

      await this.usersRepository.update(Number(data.id), {
        password,
      })

      const user = await this.usersRepository.findOneBy({ id: Number(data.id) })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return this.createToken(user)
    } catch (e) {
      throw new UnauthorizedException(e)
    }
  }

  async register(data: AuthRegisterDto) {
    delete data.role
    const user = await this.userService.create(data)
    return this.createToken(user)
  }
}
