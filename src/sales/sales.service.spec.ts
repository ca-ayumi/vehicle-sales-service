import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { isValidCpf } from '../common/cpf.util';

jest.mock('rxjs');
jest.mock('../common/cpf.util');

describe('SalesService', () => {
  let service: SalesService;

  const prismaMock: any = {
    sale: {
      create: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const httpMock: any = {
    get: jest.fn(),
    patch: jest.fn(),
  };

  beforeEach(async () => {
    (firstValueFrom as jest.Mock).mockResolvedValue(null);

    process.env.CORE_BASE_URL = 'http://core';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: HttpService, useValue: httpMock },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);

    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('should throw if CPF is invalid', async () => {
      (isValidCpf as jest.Mock).mockReturnValue(false);

      await expect(service.createSale('1', 'badcpf')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if vehicle is not AVAILABLE', async () => {
      (isValidCpf as jest.Mock).mockReturnValue(true);

      (firstValueFrom as jest.Mock).mockResolvedValueOnce({
        data: { status: 'SOLD' },
      });

      await expect(service.createSale('1', '123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create sale successfully', async () => {
      (isValidCpf as jest.Mock).mockReturnValue(true);

      httpMock.get.mockReturnValue({});
      (firstValueFrom as jest.Mock).mockResolvedValueOnce({
        data: { status: 'AVAILABLE', price: 1000 },
      });

      httpMock.patch.mockReturnValue({});
      (firstValueFrom as jest.Mock).mockResolvedValue({});

      prismaMock.sale.create.mockResolvedValue({
        id: 'sale123',
      });

      prismaMock.payment.create.mockResolvedValue({
        id: 'pay1',
        paymentCode: 'PAY-sale123',
      });

      const result = await service.createSale('1', '123');

      expect(result).toEqual({
        saleId: 'sale123',
        paymentCode: 'PAY-sale123',
        status: 'PENDING',
      });
    });
  });

  describe('handleWebhook', () => {
    it('should throw if payment not found', async () => {
      prismaMock.payment.findUnique.mockResolvedValue(null);

      await expect(
        service.handleWebhook('PAY-1', 'CONFIRMED'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update sale + payment on CONFIRMED', async () => {
      prismaMock.payment.findUnique.mockResolvedValue({
        id: 'PAYID',
        saleId: 'SALEID',
      });

      prismaMock.sale.update.mockResolvedValue({
        vehicleId: 'V1',
      });

      prismaMock.payment.update.mockResolvedValue({});

      httpMock.patch.mockReturnValue({});
      (firstValueFrom as jest.Mock).mockResolvedValue({});

      const result = await service.handleWebhook('PAY-1', 'CONFIRMED', {
        foo: 'bar',
      });

      expect(result).toEqual({ ok: true });
      expect(prismaMock.sale.update).toHaveBeenCalled();
      expect(prismaMock.payment.update).toHaveBeenCalled();
      expect(httpMock.patch).toHaveBeenCalled();
    });

    it('should update sale + payment on CANCELED', async () => {
      prismaMock.payment.findUnique.mockResolvedValue({
        id: 'PAYID',
        saleId: 'SALEID',
      });

      prismaMock.sale.update.mockResolvedValue({
        vehicleId: 'V1',
      });

      prismaMock.payment.update.mockResolvedValue({});

      httpMock.patch.mockReturnValue({});
      (firstValueFrom as jest.Mock).mockResolvedValue({});

      const result = await service.handleWebhook('PAY-1', 'CANCELED');

      expect(result).toEqual({ ok: true });
      expect(prismaMock.sale.update).toHaveBeenCalled();
      expect(prismaMock.payment.update).toHaveBeenCalled();
      expect(httpMock.patch).toHaveBeenCalled();
    });
  });
});
