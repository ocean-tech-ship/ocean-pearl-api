import { GET, Path } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { LoggerApi } from '../logger';
import { MetricsInterface } from '../services/metrics/interface/metrics.interface';
import { CalculateMetricsCommand } from '../services/metrics/command/calculate-metrics.command';

@Path('/metrics')
export class MetrictsController {
    @Inject
    _baseLogger: LoggerApi;
    @Inject
    calculateMetricsCommand: CalculateMetricsCommand;

    get logger() {
        return this._baseLogger.child('MetricsController');
    }

    @GET
    async getIndexInfo(): Promise<MetricsInterface> {
        try {
            return await this.calculateMetricsCommand.execute();
        } catch (error: any) {
            this.logger.error(error);
        }
    }
}
