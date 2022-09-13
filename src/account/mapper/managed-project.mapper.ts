import { Injectable } from '@nestjs/common';
import { Image } from '../../database/schemas/image.schema';
import { Project } from '../../database/schemas/project.schema';
import { LinkedProject } from '../models/linked-project.model';

@Injectable()
export class ManagedProjectMapper {
    public map(project: Project): LinkedProject {
        project.logo = project.logo as Image;

        const mappedProject = {
            id: project.id,
            reviewStatus: project.reviewStatus,
            origin: project.origin,
            title: project.title,
            description: project.description,
            oneLiner: project.oneLiner,
            category: project.category,
            author: project.author,
            accessAddresses: project.accessAddresses,
            mediaHandles: project.mediaHandles ?? {},
            logo: project.logo
                ? {
                      id: project.logo.id,
                      url: project.logo.url,
                  }
                : {},
            images: [],
            teamName: project.teamName,
        } as LinkedProject;

        if (project.images?.length > 0) {
            project.images = project.images as Image[];
            mappedProject.images =
                project.images?.map((image: Image) => {
                    return {
                        id: image.id,
                        url: image.url,
                    };
                }) ?? [];
        }

        return mappedProject;
    }
}
