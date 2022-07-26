import { Connection } from 'mongoose';
import { MigrationInterface } from '../interfaces/migration.interface';
import { CryptoAddress } from '../schemas/crypto-address.schema';

export default class Version100005 implements MigrationInterface {
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

        for (let project of projects) {
            const newAccessAddresses = [];
            const newAssociatedAddresses = [];
            const newPaymentAddresses = [];

            for (const address of project.accessAddresses) {
                newAccessAddresses.push(new CryptoAddress({ address: address }));
            }

            for (const address of project.associatedAddresses) {
                newAssociatedAddresses.push(new CryptoAddress({ address: address }));
            }

            for (const address of project.paymentWalletsAddresses) {
                newPaymentAddresses.push(new CryptoAddress({ address: address }));
            }

            project.accessAddresses = newAccessAddresses;
            project.associatedAddresses = newAssociatedAddresses;
            project.paymentAddresses = newPaymentAddresses;
            project.mediaHandles = project.socialMedia;

            delete project.paymentWalletsAddresses;
            delete project.socialMedia;
            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        paymentWalletsAddresses: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.walletAddress = new CryptoAddress({ address: proposal.walletAddress });

            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const projectModel = connection.model<any>('Project');
        const projects = await projectModel.find().lean();

        for (let project of projects) {
            const newAccessAddresses = [];
            const newAssociatedAddresses = [];
            const newPaymentAddresses = [];

            for (const address of project.accessAddresses) {
                newAccessAddresses.push(address.address);
            }

            for (const address of project.associatedAddresses) {
                newAssociatedAddresses.push(address.address);
            }

            for (const address of project.paymentAddresses) {
                newPaymentAddresses.push(address.address);
            }

            project.accessAddresses = newAccessAddresses;
            project.associatedAddresses = newAssociatedAddresses;
            project.paymentWalletsAddresses = newPaymentAddresses;
            project.socialMedia = project.mediaHandles;

            delete project.paymentAddresses;
            delete project.mediaHandles;
            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        paymentAddresses: 1,
                    },
                },
                { strict: false },
            );
        }

        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.walletAddress = proposal.walletAddress.address;

            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                },
                { strict: false },
            );
        }
    }
}
