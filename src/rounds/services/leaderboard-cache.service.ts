import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RoundStatusEnum } from '../enums/round-status.enum';
import { Leaderboard } from '../models/leaderboard.model';

@Injectable()
export class LeaderboardCacheService {
    private readonly ONE_DAY_TTL = 60 * 60 * 24;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    public async addToCache(leaderboard: Leaderboard): Promise<void> {
        await this.cacheManager.set<Leaderboard>(
            this.generateCacheKey(leaderboard.round),
            leaderboard,
            { ttl: this.calculateTtl(leaderboard) },
        );
    }

    public async getFromCache(round: number): Promise<Leaderboard> {
        return await this.cacheManager.get<Leaderboard>(
            this.generateCacheKey(round),
        );
    }

    public async removeFromCache(round: number): Promise<void> {
        return await this.cacheManager.del(this.generateCacheKey(round));
    }

    private generateCacheKey(round: number): string {
        return `leaderboard:${round}`;
    }

    private calculateTtl(leaderboard: Leaderboard): number {
        if (leaderboard.status === RoundStatusEnum.VotingFinished) {
            return this.ONE_DAY_TTL;
        }

        const remainingMinutes: number = new Date().getMinutes() % 5;
        const secondsOverhead: number = new Date().getSeconds();
        return (5 - remainingMinutes) * 60 - secondsOverhead;
    }
}
