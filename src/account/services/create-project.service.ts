import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';
import { ImageRepository } from '../../database/repositories/image.repository';
import { ProjectRepository } from '../../database/repositories/project.repository';
import { CryptoAddress } from '../../database/schemas/crypto-address.schema';
import { Project } from '../../database/schemas/project.schema';
import { ImageAssociationService } from '../../utils/image/services/image-association.service';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { CreateProject } from '../models/create-project.model';

@Injectable()
export class CreateProjectService {
    private readonly projectLeadRole = 'project lead';

    public constructor(
        private projectRepository: ProjectRepository,
        private imageAssociationService: ImageAssociationService,
        private imageRepository: ImageRepository,
    ) {}

    public async execute(
        createProject: CreateProject,
        walletInfo: WalletInfo,
    ): Promise<Types.ObjectId> {
        try {
            const newProject = new Project({
                author: walletInfo.address,
                title: createProject.title,
                oneLiner: createProject.oneLiner,
                description: createProject.description,
                category: createProject.category,
                mediaHandles: createProject.mediaHandles ?? new Map<MediaHandlesEnum, string>(),
                teamName: createProject.teamName ?? createProject.title,
            });

            await this.addlogo(newProject, createProject);
            await this.addImages(newProject, createProject);
            this.addCryptoAddresses(newProject, createProject);

            return (await this.projectRepository.create(newProject))._id;
        } catch (error) {
            throw error;
        }
    }

    private async addlogo(newProject: Project, createProject: CreateProject): Promise<void> {
        if (createProject.logo) {
            if (Object.keys(createProject.logo).length !== 0) {
                const newLogo = await this.imageRepository.findOneRaw({
                    find: { id: createProject.logo.id },
                });

                if (!(await this.imageAssociationService.isImageUnassociated(newLogo))) {
                    throw new UnauthorizedException(
                        'New logo already belongs to a different project',
                    );
                }

                newProject.logo = newLogo._id;
            }
        }
    }

    private async addImages(newProject: Project, createProject: CreateProject): Promise<void> {
        if (createProject.images) {
            for (const image of createProject.images) {
                const newImage = await this.imageRepository.findOneRaw({
                    find: { id: image.id },
                });

                if (!(await this.imageAssociationService.isImageUnassociated(newImage))) {
                    throw new UnauthorizedException(
                        'New image already belongs to a different project',
                    );
                }

                newProject.images = newProject.images as Types.ObjectId[];
                newProject.images.push(newImage._id);
            }
        }
    }

    private addCryptoAddresses(newProject: Project, createProject: CreateProject): void {
        if (createProject.accessAddresses) {
            for (const cryptoAddress of createProject.accessAddresses) {
                const newAddress = new CryptoAddress(cryptoAddress);
                newProject.accessAddresses.push(newAddress);
                newProject.associatedAddresses.push(newAddress);
            }
        }

        // Ensure that at least the author's address has access
        if (!newProject.accessAddresses.includes(newProject.author)) {
            newProject.accessAddresses.push(newProject.author);
            newProject.associatedAddresses.push(newProject.author);
        }

        // for (const cryptoAddress of createProject.paymentAddresses) {
        //     const newAddress = new CryptoAddress(cryptoAddress);
        //     newProject.paymentAddresses.push(newAddress);
        //     newProject.associatedAddresses.push(newAddress);
        // }
    }

    // We might need this later
    // private addTeamMembers(newProject: Project, createProject: CreateProject): void {
    //     for (const createTeamMember of createProject.team) {
    //         newProject.members.push(
    //             new TeamMember(createTeamMember)
    //         );
    //     }
    // }

    // private async validateProject(createProject: CreateProject): Promise<void> {
    //     if (createProject.team) {
    //         new BadRequestException('Project needs at least one team member.');
    //     }

    //     for (const teamMemeber of createProject.team) {
    //         if (teamMemeber.role === this.projectLeadRole) {
    //             return;
    //         }
    //     }

    //     new BadRequestException('At least one team member must be a team lead.');
    // }
}
