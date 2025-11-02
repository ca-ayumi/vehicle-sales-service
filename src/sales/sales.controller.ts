import { Controller, Body, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.service.createSale(dto.vehicleId, dto.buyerCpf);
  }
}
