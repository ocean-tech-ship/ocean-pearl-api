import { Connection } from 'mongoose';
import { MigrationInterface } from '../interfaces/migration.interface';
import { AddressFormatService } from '../../utils/wallet/services/address-format.service';

export default class Version100005 implements MigrationInterface {
    private addressFormatService = new AddressFormatService();

    public getVersion(): number {
        // count this number up with each migration
        return 100005;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Change the type and structure of walletAddresses and mediaHandles of projects.';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const projectModel = connection.model<any>('Project');
        const projects = await projectModel.find().lean();

        for (const project of projects) {
            const newAccessAddresses = [];
            const newAssociatedAddresses = [];
            const newPaymentAddresses = [];

            for (const address of project.accessAddresses) {
                newAccessAddresses.push(this.addressFormatService.execute(address));
            }

            for (const address of project.associatedAddresses) {
                newAssociatedAddresses.push(this.addressFormatService.execute(address));
            }

            for (const address of project.paymentWalletsAddresses) {
                newPaymentAddresses.push(this.addressFormatService.execute(address));
            }

            project.accessAddresses = newAccessAddresses;
            project.associatedAddresses = newAssociatedAddresses;
            project.paymentAddresses = newPaymentAddresses;
            project.mediaHandles = project.socialMedia;

            if (project.author) {
                project.author = this.addressFormatService.execute(project.author);
            }

            delete project.paymentWalletsAddresses;
            delete project.socialMedia;

            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        paymentWalletsAddresses: 1,
                        socialMedia: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (const proposal of proposals) {
            proposal.author = this.addressFormatService.execute(proposal.walletAddress);

            delete proposal.walletAddress;

            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        walletAddress: 1,
                    },
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const projectModel = connection.model<any>('Project');
        const projects = await projectModel.find().lean();

        for (const project of projects) {
            const newAccessAddresses = [];
            const newAssociatedAddresses = [];
            const newPaymentAddresses = [];

            for (const address of project.accessAddresses) {
                newAccessAddresses.push(address.toLowerCase());
            }

            for (const address of project.associatedAddresses) {
                newAssociatedAddresses.push(address.toLowerCase());
            }

            for (const address of project.paymentAddresses) {
                newPaymentAddresses.push(address.toLowerCase());
            }

            project.accessAddresses = newAccessAddresses;
            project.associatedAddresses = newAssociatedAddresses;
            project.paymentWalletsAddresses = newPaymentAddresses;
            project.socialMedia = project.mediaHandles;

            if (project.author) {
                project.author = project.author.toLowerCase();
            }

            delete project.paymentAddresses;
            delete project.mediaHandles;

            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        paymentAddresses: 1,
                        mediaHandles: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (const proposal of proposals) {
            proposal.walletAddress = proposal.author.toLowerCase();

            delete proposal.author;
            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        author: 1,
                    },
                },
                { strict: false },
            );
        }
    }
}
