import { Types } from 'mongoose';
import { ProjectInterface } from '../../../database';

export abstract class GetProjectByIdCommandApi {
    abstract execute(id: Types.ObjectId): Promise<ProjectInterface>;
}