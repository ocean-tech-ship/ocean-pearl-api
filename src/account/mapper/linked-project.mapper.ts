import { Injectable } from '@nestjs/common';
import { CategoryEnum } from '../../database/enums/category.enum';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { Image } from '../../database/schemas/image.schema';
import { Post } from '../../database/schemas/post.schema';
import { Project } from '../../database/schemas/project.schema';
import { LinkedPost } from '../models/linked-post.model';
import { LinkedImage, LinkedProject } from '../models/linked-project.model';

@Injectable()
export class LinkedProjectMapper {
    public map(project: Project): LinkedProject {
        project.logo = project.logo as Image;

        const mappedProject = new LinkedProject({
            id: project.id,
            reviewStatus: project.reviewStatus,
            origin: project.origin,
            title: project.title,
            description: project.description,
            oneLiner: project.oneLiner,
            category: project.category as CategoryEnum,
            author: project.author,
            accessAddresses: project.accessAddresses,
            mediaHandles: project.mediaHandles ?? ({} as Map<MediaHandlesEnum, string>),
            logo: project.logo
                ? new LinkedImage({
                      id: project.logo.id,
                      url: project.logo.url,
                  })
                : new LinkedImage(),
            images: [],
            teamName: project.teamName,
        });

        if (project.images?.length > 0) {
            project.images = project.images as Image[];
            mappedProject.images =
                project.images?.map(
                    (image: Image) =>
                        new LinkedImage({
                            id: image.id,
                            url: image.url,
                        }),
                ) ?? [];
        }

        for (const post of project.posts as Post[]) {
            post.images = post.images as Image[];
            mappedProject.posts.push(
                new LinkedPost({
                    id: post.id,
                    reviewStatus: post.reviewStatus,
                    author: post.author,
                    title: post.title,
                    text: post.text,
                    images: post.images.map((image: Image) => {
                        return new LinkedImage({
                            id: image.id,
                            url: image.url,
                        });
                    }),
                    createdAt: post.createdAt,
                }),
            );
        }

        return mappedProject;
    }
}
