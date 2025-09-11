import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePutUserDto } from './dto/update-put-user.dto'
import { UpdatePatchUserDto } from './dto/update-patch-user.dto'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { UserEntity } from './entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDto) {
    if (await this.usersRepository.exists({ where: { email: data.email } })) {
      throw new NotFoundException(`O email ${data.email} já está em uso`)
    }

    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())

    const user = this.usersRepository.create(data)
    return this.usersRepository.save(user)
  }

  async list() {
    return this.usersRepository.find()
  }

  async findById(id: number) {
    await this.exist(id)
    return this.usersRepository.findOneBy({ id })
  }

  async update(id: number, { name, email, password, birthAt, role }: UpdatePutUserDto) {
    await this.exist(id)

    password = await bcrypt.hash(password, await bcrypt.genSalt())

    await this.usersRepository.update(id, {
      name,
      email,
      password,
      birthAt: new Date(birthAt),
      role,
    })

    return this.findById(id)
  }

  async updatePartial(id: number, { name, email, password, birthAt, role }: UpdatePatchUserDto) {
    await this.exist(id)
    const data: UpdatePatchUserDto = {}

    if (birthAt) {
      data.birthAt = new Date(birthAt)
    }

    if (name) {
      data.name = name
    }

    if (email) {
      data.email = email
    }

    if (role) {
      console.log(role)
      data.role = role
    }

    if (password) {
      data.password = await bcrypt.hash(password, await bcrypt.genSalt())
    }

    await this.usersRepository.update(id, data)

    return this.findById(id)
  }

  async delete(id: number) {
    await this.exist(id)
    await this.usersRepository.delete(id)
    return true
  }

  async exist(id: number) {
    if (
      !(await this.usersRepository.exists({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário do id ${id} não existe`)
    }
  }
}
