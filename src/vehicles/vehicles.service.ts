import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VehiclesService {
  constructor(private readonly http: HttpService) {}
  private coreBase = process.env.CORE_BASE_URL;

  async listByStatus(status: 'AVAILABLE' | 'SOLD') {
    const { data } = await firstValueFrom(
      this.http.get(`${this.coreBase}/vehicles`, {
        params: { status },
      }),
    );

    return [...data].sort((a, b) => Number(a.price) - Number(b.price));
  }
}
