import { LeaderboardProposal } from '../models/leaderboard-proposal.model';
import { Leaderboard } from '../models/leaderboard.model';

export interface leaderboardStrategyInterface {
    canHandle(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): boolean;

    execute(
        proposal: LeaderboardProposal,
        leaderboard: Leaderboard,
    ): Leaderboard;
}
