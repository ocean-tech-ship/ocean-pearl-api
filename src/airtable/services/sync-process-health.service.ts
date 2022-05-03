import { Injectable } from '@nestjs/common';
import { SyncRoundsDataService } from './sync-rounds-data.service';
import { SyncProposalsDataService } from './sync-proposals-data.service';

@Injectable()
export class SyncProcessHealthService {
    private static EXECUTION_TIME_THRESHOLD = 1000 * 60 * 5; // 5 minutes

    public constructor(
        private readonly roundSync: SyncRoundsDataService,
        private readonly proposalSync: SyncProposalsDataService,
    ) {}

    /**
     * @return true if service is working properly
     */
    public isHealthy(): boolean {
        const oldestAllowed = Date.now() - SyncProcessHealthService.EXECUTION_TIME_THRESHOLD;
        return (
            this.verifyTimestamp(this.roundSync.getOpenRunTimestamp(), oldestAllowed) &&
            this.verifyTimestamp(this.proposalSync.getOpenRunTimestamp(), oldestAllowed)
        );
    }

    /**
     * @param timestamp Timestamp to verify, -1 if process completed successfully
     * @param oldestAllowed Threshold timestamp
     * @return true if timestamp is healthy
     */
    private verifyTimestamp(timestamp: number, oldestAllowed: number): boolean {
        // If timestamp is not set the process is not running or has completed successfully
        return timestamp === -1 || timestamp > oldestAllowed;
    }
}
