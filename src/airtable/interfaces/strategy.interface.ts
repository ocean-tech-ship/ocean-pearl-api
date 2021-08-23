import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Project } from '../../database/schemas/project.schema';

export interface StrategyInterface {
    canHandle(project: Project, proposal: DaoProposal): Promise<boolean>;
    execute(project: Project, proposal: DaoProposal, newProposal: DaoProposal, airtableData: any): void;
}