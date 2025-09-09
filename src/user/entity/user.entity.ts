import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ length: 63 })
  name: string
  @Column({ unique: true, length: 127 })
  email: string
  @Column({ length: 127 })
  password: string
  @Column({ type: 'date', nullable: true })
  birthAt: Date
  @Column({ enum: [1, 2], default: 1 }) // 1: user, 2: admin
  role: number
  @CreateDateColumn()
  createdAt: string
  @UpdateDateColumn()
  updatedAt: string
}
