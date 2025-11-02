import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { SalesService } from '../sales/sales.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let salesService: SalesService;

  const mockSalesService = {
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: SalesService, useValue: mockSalesService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    salesService = module.get<SalesService>(SalesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleWebhook', () => {
    it('should call salesService.handleWebhook with correct params', async () => {
      mockSalesService.handleWebhook.mockResolvedValue('ok');

      const result = await service.handleWebhook(
        'code123',
        'CONFIRMED',
        { foo: 'bar' },
      );

      expect(mockSalesService.handleWebhook).toHaveBeenCalledWith(
        'code123',
        'CONFIRMED',
        { foo: 'bar' },
      );

      expect(result).toBe('ok');
    });

    it('should accept undefined providerPayload', async () => {
      mockSalesService.handleWebhook.mockResolvedValue('ok');

      const result = await service.handleWebhook(
        'code123',
        'CANCELED',
      );

      expect(mockSalesService.handleWebhook).toHaveBeenCalledWith(
        'code123',
        'CANCELED',
        undefined,
      );

      expect(result).toBe('ok');
    });
  });
});
