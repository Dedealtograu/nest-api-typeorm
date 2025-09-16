import { forwardRef, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user/entity/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: process.env.ENV === 'test' ? '.env.test' : '.env', isGlobal: true }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 100 }] }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'aileen.feil@ethereal.email',
            pass: 'uJyJwRGjt3UhKzD4kF',
          },
        },
        defaults: {
          from: 'nest-api" <aileen.feil@ethereal.email>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
  exports: [AppService],
})
export class AppModule {}
