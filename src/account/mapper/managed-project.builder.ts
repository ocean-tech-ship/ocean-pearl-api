import { Injectable } from '@nestjs/common';
import { Picture } from '../../database/models/picture.model';
import { Project } from '../../database/schemas/project.schema';
import { AssociatedProject } from '../models/associated-project.model';

@Injectable()
export class ManagedProjectMapper {
    public map(project: Project): AssociatedProject {
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
                      key: project.logo.key,
                      url: project.logo.url,
                  }
                : {},
            pictures: [],
            teamName: project.teamName,
        } as AssociatedProject;

        mappedProject.pictures = project.pictures.map((picture: Picture) => {
            return {
                key: picture.key,
                url: picture.url,
            };
        });

        return mappedProject;
    }
}
