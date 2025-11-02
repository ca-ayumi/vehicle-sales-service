import { Controller, Get } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get('for-sale')
  listForSale() {
    return this.service.listByStatus('AVAILABLE');
  }

  @Get('sold')
  listSold() {
    return this.service.listByStatus('SOLD');
  }
}
