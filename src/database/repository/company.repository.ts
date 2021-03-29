import { Company, CompanyInterface } from "../model/company.model";
import { AbstractRepository } from "./abstract.repository";

export class CompanyRepository extends AbstractRepository<CompanyInterface> {

    constructor() {
        super(Company);
    }
}