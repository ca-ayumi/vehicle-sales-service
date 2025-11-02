import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('VehiclesService', () => {
  let service: VehiclesService;

  const httpMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    process.env.CORE_BASE_URL = 'http://core';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: HttpService, useValue: httpMock },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);

    jest.clearAllMocks();
  });

  describe('listByStatus', () => {
    it('should call core API and return sorted list', async () => {
      const vehicles = [
        { id: '2', price: 30000 },
        { id: '1', price: 20000 },
        { id: '3', price: 50000 },
      ];

      httpMock.get.mockReturnValue(of({ data: vehicles }));

      const result = await service.listByStatus('AVAILABLE');

      expect(httpMock.get).toHaveBeenCalledWith('http://core/vehicles', {
        params: { status: 'AVAILABLE' },
      });

      expect(result).toEqual([
        { id: '1', price: 20000 },
        { id: '2', price: 30000 },
        { id: '3', price: 50000 },
      ]);
    });
  });
});
