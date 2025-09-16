import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { AuthForgetDto } from './dto/auth-forget.dto'
import { AuthResetDto } from './dto/auth-reset.dto'
import { AuthService } from './auth.service'
import { AuthGuard } from '../guards/auth.guard'
import { User } from '../decorators/user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from '../file/file.service'
import { UserEntity } from '../user/entity/user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body)
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email)
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token)
  }

  @UseGuards(AuthGuard)
  @Post('me')
  me(@User() user: UserEntity) {
    return user
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    // eslint-disable-next-line
    const fieldname = `photo-${user.id}.png` 

    try {
      await this.fileService.upload(photo, fieldname)
    } catch (e) {
      throw new BadRequestException(e)
    }

    return photo
  }

  // @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  // @Post('files')
  // async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
  //   return files
  // }

  // @UseInterceptors(FileFieldsInterceptor([{ name: 'files1' }, { name: 'files2' }]))
  // @UseGuards(AuthGuard)
  // @Post('files-fields')
  // async uploadFilesFields(@User() user, @UploadedFiles() files: Express.Multer.File[]) {
  //   return files
  // }
}
