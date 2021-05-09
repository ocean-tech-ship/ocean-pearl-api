import { Types } from 'mongoose';
import { ProjectInterface } from "../../database/model/project.model";

export abstract class ProjectApi {
    abstract getProjects(): Promise<ProjectInterface[]>;
    abstract getFeaturedProjects(): Promise<ProjectInterface[]>;
    abstract getProjectById(id: Types.ObjectId): Promise<ProjectInterface>;
}
