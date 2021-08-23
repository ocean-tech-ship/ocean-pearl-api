import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Metrics } from './interfaces/metrics.interface';
import { CalculateMetricsService } from './services/calculate-metrics.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  public constructor(
    private calculateMetricsService: CalculateMetricsService,
  ) {}

  @Get()
  async getIndexInfo(): Promise<Metrics> {
    try {
      return await this.calculateMetricsService.execute();
    } catch (error: any) {
      throw error;
    }
  }
}
