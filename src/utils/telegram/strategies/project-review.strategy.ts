import { ReviewStrategyInterface } from '../interfaces/review-strategy.interface';
import { ProjectReviewModel } from '../models/project-review.models';
import { ReviewStatusEnum } from '../../../database/enums/review-status.enum';
import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../../database/repositories/project.repository';

@Injectable()
export class ProjectReviewStrategy extends ProjectReviewModel implements ReviewStrategyInterface {
    constructor(private projectRepository: ProjectRepository) {
        super();
    }

    async writeAndPersist(
        id: string,
        status?: ReviewStatusEnum,
        reviewer?: string,
        reason?: string,
    ): Promise<string> {
        const model = await this.projectRepository.findOneRaw({
            find: {
                id,
            },
        });

        // TODO: mutate repository (reason is missing)
        model.reviewStatus = status ?? model.reviewStatus;

        await this.projectRepository.update(model);
        return super.write(model, model.reviewStatus, reviewer, reason);
    }
}
