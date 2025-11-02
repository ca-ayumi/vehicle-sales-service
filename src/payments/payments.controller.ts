import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('webhook')
  webhook(@Body() body: any) {
    const { paymentCode, status, providerPayload } = body;
    return this.service.handleWebhook(paymentCode, status, providerPayload);
  }
}
