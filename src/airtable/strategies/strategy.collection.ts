import { Injectable } from '@nestjs/common';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';
import { StrategyInterface } from '../interfaces/strategy.interface';
import { MissmatchedProposalStrategy } from './missmatched-proposal.strategy';
import { NewProjectStrategy } from './new-project.strategy';
import { NewProposalStrategy } from './new-proposal.strategy';
import { SingleMissmatchedProposalStrategy } from './single-missmatched-proposal.strategy';
import { UpdateProposalStrategy } from './update-proposal.strategy';

@Injectable()
export class StrategyCollection {
    private strategies: StrategyInterface[];

    constructor(
        private newProjectStrategy: NewProjectStrategy,
        private newProposalStrategy: NewProposalStrategy,
        private updateProposalStrategy: UpdateProposalStrategy,
        private missmatchedProposalStrategy: MissmatchedProposalStrategy,
        private singleMissmatchedProposalStrategy: SingleMissmatchedProposalStrategy,
    ) {
        this.strategies = [
            this.updateProposalStrategy,
            this.newProjectStrategy,
            this.newProposalStrategy,
            this.singleMissmatchedProposalStrategy,
        ];
    }

    public async findMatchingStrategy(
        project: Project,
        proposal: DaoProposal,
    ): Promise<StrategyInterface> {
        for (const strategy of this.strategies) {
            if (await strategy.canHandle(project, proposal)) {
                return strategy;
            }
        }

        return this.missmatchedProposalStrategy;
    }
}
