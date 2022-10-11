import { ReadResultModel } from '../models/read-result.model';
import { ReviewStatusEnum } from '../../../database/enums/review-status.enum';

export interface ReviewStrategyInterface {
    /**
     * Check if this strategy is capable of handling the provided message.
     * @param text Telegram message to analyze
     */
    canHandle(text: string): boolean;

    /**
     * Read necessary information from the telegram message.
     * @param text Telegram message to analyze
     */
    read(text: string): ReadResultModel;

    /**
     * Fetches the record from the repository, persists the new state and writes a telegram message with the final state.
     * @param id Id
     * @param status New review status
     * @param reviewer New reviewer telegram handle
     * @param reason New review result reason
     */
    writeAndPersist(
        id: string,
        status?: ReviewStatusEnum,
        reviewer?: string,
        reason?: string,
    ): Promise<string>;
}
