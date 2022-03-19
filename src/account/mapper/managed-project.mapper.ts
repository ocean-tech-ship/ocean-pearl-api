import { Injectable } from '@nestjs/common';
import { Image } from '../../database/schemas/image.schema';
import { Project } from '../../database/schemas/project.schema';
import { AssociatedProject } from '../models/associated-project.model';

@Injectable()
export class ManagedProjectMapper {
    public map(project: Project): AssociatedProject {
        project.logo = project.logo as Image;

        const mappedProject = {
            id: project.id,
            title: project.title,
            description: project.description,
            oneLiner: project.oneLiner,
            category: project.category,
            accessAddresses: project.accessAddresses,
            socialMedia: project.socialMedia ?? {},
            logo: project.logo
                ? {
                      id: project.logo.id,
                      url: project.logo.url,
                  }
                : {},
            images: [],
            teamName: project.teamName,
        } as AssociatedProject;

        if (project.images.length > 0) {
            project.images = project.images as Image[];
            mappedProject.images = project.images?.map((image: Image) => {
                return {
                    id: image.id,
                    url: image.url,
                };
            }) ?? [];
        }

        return mappedProject;
    }
} 
