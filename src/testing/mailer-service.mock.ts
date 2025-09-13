import { MailerService } from '@nestjs-modules/mailer'

export const mailerServiceyMock = {
  provide: MailerService,
  useValue: {
    sendMail: jest.fn(),
  },
}
