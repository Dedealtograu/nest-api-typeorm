import { Role } from '../enums/role.enums'
import { UserEntity } from '../user/entity/user.entity'

export const userEntityListMock: UserEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'bVXhU@example.com',
    password: '$2b$10$7wLZulUwkNcDzMge4l8uFO2Yr46i81ALEN5L7zAC341xD3Z16ZxLC',
    birthAt: new Date(),
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'bVXhU@example.com',
    password: '$2b$10$q4SMdHnyUeVsBjnL3D1FlesprdaFdYatbpQN43SivK.n0kqP31qrG',
    birthAt: new Date(),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'bVXhU@example.com',
    password: '$2b$10$q4SMdHnyUeVsBjnL3D1FlesprdaFdYatbpQN43SivK.n0kqP31qrG',
    birthAt: new Date(),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
