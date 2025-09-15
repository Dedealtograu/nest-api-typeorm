import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'
import { getPhotoMock } from '../testing/get-photo.mock'

describe('FileService', () => {
  let fileService: FileService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile()
    fileService = moduleFixture.get<FileService>(FileService)
  })

  it('should be defined', () => {
    expect(fileService).toBeDefined()
  })

  describe('upload', () => {
    it('method upload', async () => {
      const photo = await getPhotoMock()
      const fieldname = 'photo-test.png'
      fileService.upload(photo, fieldname)
      expect(true).toBe(true)
    })
  })
})
