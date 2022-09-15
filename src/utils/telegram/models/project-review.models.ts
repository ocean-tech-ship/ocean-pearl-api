import { Project } from '../../../database/schemas/project.schema';
import { ReadResultModel } from './read-result.model';
import { ReviewStatusEnum } from '../../../database/enums/review-status.enum';
import { ReviewModelBase } from '../interfaces/review-model-base.interface';
import { NewReviewInterface } from '../interfaces/new-review.interface';

export class ProjectReviewModel implements ReviewModelBase<Project> {
    canHandle(text: string): boolean {
        const type = text.split('\n')?.[0]?.split(' - ')?.[0];
        return type.toLowerCase().includes('project');
    }

    read(text: string): ReadResultModel {
        const lines = text.split('\n');
        const id = lines?.[0]?.split(' - ')?.[1].replace('_', '');
        const reviewer = lines?.[1].includes('@')
            ? lines?.[1]?.substring(lines?.[1]?.indexOf('@') + 1)
            : null;
        return {
            id,
            reviewer,
        };
    }

    write(model: Project, status?: ReviewStatusEnum, reviewer?: string, reason?: string) {
        return [
            `*Project* \\- _${model.id}_`,
            `*Review* ${status ?? 'unknown'} by @${reviewer ?? '/'}`,
            `\\> ${reason ?? '/'}`,
            ``,
            `*Title*`,
            `\`${model.title}\``,
            `*OneLiner*`,
            `\`${model.oneLiner}\``,
            `*Description*`,
            `\`${model.description}\``,
        ].join('\n');
    }
}

export class NewProjectReviewRequest extends ProjectReviewModel implements NewReviewInterface {
    constructor(private model: Project) {
        super();
    }

    initialWriter(): string {
        return super.write(this.model, null, null, null);
    }
}
