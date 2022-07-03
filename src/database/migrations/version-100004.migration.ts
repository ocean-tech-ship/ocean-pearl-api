import { Connection } from 'mongoose';
import { MigrationInterface } from '../interfaces/migration.interface';
import { Image } from '../schemas/image.schema';

export default class Version100004 implements MigrationInterface {
    public getVersion(): number {
        // count this number up with each migration
        return 100004;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Move all images and logos to an extra collection and link entries via the _id.';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const projectModel = connection.model<any>('Project');
        const imageModel = connection.model<any>('Image');
        const projects = await projectModel.find().lean();

        for (let project of projects) {
            if (project.logo) {
                const logo = {
                    key: project.logo.key,
                    fileExtension: project.logo.fileExtension,
                    url: project.logo.url,
                } as Image;

                project.logo = (await imageModel.create(logo))._id;
            }

            const images: string[] = [];
            for (const image of project.pictures) {
                const newImage = {
                    key: image.key,
                    fileExtension: image.fileExtension,
                    url: image.url,
                } as Image;

                images.push((await imageModel.create(newImage))._id);
            }
            project.images = images;

            delete project.pictures;
            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        pictures: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.images = [];

            delete proposal.pictures;
            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        pictures: 1,
                    },
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const projectModel = connection.model<any>('Project');
        const imageModel = connection.model<any>('Image');
        const projects = await projectModel.find().lean();

        for (let project of projects) {
            if (project.logo) {
                const logo = await imageModel.findOne({ id: project.logo });

                project.logo = {
                    key: logo.key,
                    fileExtension: logo.fileExtension,
                    url: logo.url,
                } as Image;
            }

            const images: Image[] = [];
            for (const image of project.images) {
                const newImage = await imageModel.findOne({_id: image});

                images.push({
                    key: newImage.key,
                    fileExtension: newImage.fileExtension,
                    url: newImage.url,
                } as Image);
            }
            project.pictures = images;

            delete project.images
            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        images: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.pictures = [];

            delete proposal.images;
            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        images: 1,
                    },
                },
                { strict: false },
            );
        }
    }
}
