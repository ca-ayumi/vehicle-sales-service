import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { isValidCpf } from '../common/cpf.util';

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
  ) {}

  private coreBase = process.env.CORE_BASE_URL;

  async createSale(vehicleId: string, buyerCpf: string) {
    if (!isValidCpf(buyerCpf)) {
      throw new BadRequestException('CPF inválido');
    }

    const { data: vehicle } = await firstValueFrom(
      this.http.get(`${this.coreBase}/vehicles/${vehicleId}`),
    );

    if (vehicle?.status !== 'AVAILABLE') {
      throw new BadRequestException('Veículo indisponível');
    }

    await firstValueFrom(
      this.http.patch(`${this.coreBase}/vehicles/${vehicleId}/status`, {
        status: 'RESERVED',
      }),
    );

    const sale = await this.prisma.sale.create({
      data: {
        vehicleId,
        buyerCpf,
        priceSnapshot: vehicle.price,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        saleId: sale.id,
        paymentCode: `PAY-${sale.id}`,
      },
    });

    return {
      saleId: sale.id,
      paymentCode: payment.paymentCode,
      status: 'PENDING',
    };
  }

  async handleWebhook(paymentCode: string, status: 'CONFIRMED' | 'CANCELED', providerPayload?: any) {
    const payment = await this.prisma.payment.findUnique({ where: { paymentCode } });

    if (!payment) {
      throw new BadRequestException('Pagamento não encontrado');
    }

    const sale = await this.prisma.sale.update({
      where: { id: payment.saleId },
      data: { status: status === 'CONFIRMED' ? 'PAID' : 'CANCELED' },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status, providerPayload },
    });

    const newStatus = status === 'CONFIRMED' ? 'SOLD' : 'AVAILABLE';

    await firstValueFrom(
      this.http.patch(`${this.coreBase}/vehicles/${sale.vehicleId}/status`, {
        status: newStatus,
      }),
    );

    return { ok: true };
  }
}
