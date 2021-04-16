import { Job, JobInterface } from "../model/job.model";
import { AbstractRepository } from "./abstract.repository";

export class JobRepository extends AbstractRepository<JobInterface> {

    constructor() {
        super(Job);
    }
}