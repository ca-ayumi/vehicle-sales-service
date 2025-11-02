import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const serviceMock = {
    listByStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);

    jest.clearAllMocks();
  });

  describe('listForSale', () => {
    it('should call service.listByStatus with AVAILABLE', async () => {
      serviceMock.listByStatus.mockResolvedValue([]);

      const result = await controller.listForSale();

      expect(serviceMock.listByStatus).toHaveBeenCalledWith('AVAILABLE');
      expect(result).toEqual([]);
    });
  });

  describe('listSold', () => {
    it('should call service.listByStatus with SOLD', async () => {
      serviceMock.listByStatus.mockResolvedValue([]);

      const result = await controller.listSold();

      expect(serviceMock.listByStatus).toHaveBeenCalledWith('SOLD');
      expect(result).toEqual([]);
    });
  });
});
