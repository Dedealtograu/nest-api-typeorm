import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../src/app.module'
import { authRegisterDtoMock } from '../src/testing/auth-register-dto.mpck'
import { Role } from '../src/enums/role.enums'
import dataSource from '../typeorm/data-source'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>
  let accessToken: string
  let userId: number

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })

  it('Registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send(authRegisterDtoMock)

    expect(response.status).toBe(201)
    expect(typeof response.body.accessToken).toEqual('string')
  })

  it('Fazer login com um usuário registrado', async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email: authRegisterDtoMock.email,
      password: authRegisterDtoMock.password,
    })

    expect(response.status).toBe(201)
    expect(typeof response.body.accessToken).toEqual('string')

    accessToken = response.body.accessToken
  })

  it('Obter perfil do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(201)
    expect(typeof response.body.id).toEqual('number')
    expect(response.body.role).toEqual(Role.User)
  })

  it('Tentar registrar um novo usuário como administrador', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDtoMock,
        role: Role.Admin,
        email: 'admin@admin.com',
      })

    expect(response.status).toBe(201)
    expect(typeof response.body.accessToken).toEqual('string')

    accessToken = response.body.accessToken
  })

  it('Obter perfil do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(201)
    expect(typeof response.body.id).toEqual('number')
    expect(response.body.role).toEqual(Role.User)

    userId = response.body.id
  })

  it('Listar todos os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(403)
    expect(response.body.error).toEqual('Forbidden')
  })

  it('Alterando o perfil do usuário para administrador', async () => {
    const ds = await dataSource.initialize()
    const queryRunner = ds.createQueryRunner()

    await queryRunner.query(`UPDATE users SET role = '${Role.Admin}' WHERE id = ${userId}`)
    const rows = await queryRunner.query(`SELECT * FROM users WHERE id = ${userId}`)
    await queryRunner.release()
    await ds.destroy()

    expect(rows.length).toEqual(1)
    expect(rows[0].role).toEqual(Role.Admin)
  })

  it('Listar todos os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(2)
  })
})
