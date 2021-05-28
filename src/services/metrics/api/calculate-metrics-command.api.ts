import { MetricsInterface } from '../interface/metrics.interface';

export abstract class CalculateMetricsCommandApi {
    abstract execute(): Promise<MetricsInterface>;
}
