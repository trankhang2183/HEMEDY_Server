import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { Controller } from '@nestjs/common';

@ApiTags('EmailService')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
}
