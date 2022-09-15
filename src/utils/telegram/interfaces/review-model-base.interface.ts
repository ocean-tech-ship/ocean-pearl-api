import { ReadResultModel } from '../models/read-result.model';
import { ReviewStatusEnum } from '../../../database/enums/review-status.enum';

export interface ReviewModelBase<T> {
    canHandle(text: string): boolean;
    read(text: string): ReadResultModel;
    write(model: T, status?: ReviewStatusEnum, reviewer?: string, reason?: string);
}
