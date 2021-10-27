import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Metrics } from './models/metrics.model';
import { CalculateMetricsService } from './services/calculate-metrics.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  public constructor(
    private calculateMetricsService: CalculateMetricsService,
  ) {}

  @Get()
  @ApiQuery(
    {name: 'round', required: false}, 
  )
  @ApiOkResponse({
    type: Metrics,
    description: 'Returns metric for the given round',
})
  async getIndexInfo(
    @Query('round', new DefaultValuePipe(0), ParseIntPipe) round: number,
  ): Promise<Metrics> {
    try {
      return await this.calculateMetricsService.execute(round);
    } catch (error: any) {
      throw error;
    }
  }
}
