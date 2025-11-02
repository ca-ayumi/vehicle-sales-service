import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from './prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    VehiclesModule,
    SalesModule,
    PaymentsModule,
  ],
})
export class AppModule {}
