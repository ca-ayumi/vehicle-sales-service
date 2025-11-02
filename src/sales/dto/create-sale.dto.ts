import { IsUUID, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsUUID()
  vehicleId!: string;

  @IsString()
  buyerCpf!: string;
}
