import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockService = {
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockService }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('webhook', () => {
    it('should call service.handleWebhook with correct params', async () => {
      const body = {
        paymentCode: '123',
        status: 'CONFIRMED',
        providerPayload: { id: 'abc' },
      };

      mockService.handleWebhook.mockResolvedValue('ok');

      const result = await controller.webhook(body);

      expect(service.handleWebhook).toHaveBeenCalledWith('123', 'CONFIRMED', {
        id: 'abc',
      });

      expect(result).toBe('ok');
    });
  });
});
