import { Project, ProjectInterface } from "../model/project.model";
import { AbstractRepository } from "./abstract.repository";

export class ProjectRepository extends AbstractRepository<ProjectInterface> {

    constructor() {
        super(Project);
    }
}