import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

describe('SalesController', () => {
  let controller: SalesController;

  const mockService = {
    createSale: jest.fn(),
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [{ provide: SalesService, useValue: mockService }],
    }).compile();

    controller = module.get<SalesController>(SalesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.createSale with correct params', async () => {
      const dto = {
        vehicleId: 'vehicle-1',
        buyerCpf: '12345678900',
      };

      const response = {
        saleId: '1',
        paymentCode: 'abc123',
        status: 'PENDING',
      };

      mockService.createSale.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(result).toEqual(response);
      expect(mockService.createSale).toHaveBeenCalledWith(
        dto.vehicleId,
        dto.buyerCpf,
      );
    });
  });
});
