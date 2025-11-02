import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly salesService: SalesService) {}

  async handleWebhook(
    paymentCode: string,
    status: 'CONFIRMED' | 'CANCELED',
    providerPayload?: any,
  ) {
    return this.salesService.handleWebhook(
      paymentCode,
      status,
      providerPayload,
    );
  }
}
