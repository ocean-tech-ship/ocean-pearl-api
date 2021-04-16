import { DaoProposal, DaoProposalInterface } from "../model/dao-proposal.model";
import { AbstractRepository } from "./abstract.repository";

export class DaoProposalRepository extends AbstractRepository<DaoProposalInterface> {

    constructor() {
        super(DaoProposal);
    }
}