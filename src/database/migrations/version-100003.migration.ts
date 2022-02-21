import { Connection } from 'mongoose';
import { MigrationInterface } from '../interfaces/migration.interface';
import { Funding } from '../schemas/funding.schema';

export default class Version100002 implements MigrationInterface {
    public getVersion(): number {
        // count this number up with each migration
        return 100003;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Rework of the current schemas and attribute names of all collections.';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.yesVotes = proposal.votes;
            proposal.noVotes = proposal.counterVotes;
            proposal.requestedFunding = {
                usd: proposal.requestedGrantUsd,
                ocean: proposal.requestedGrantToken,
            } as Funding;
            proposal.receivedFunding = {
                usd: proposal.grantedUsd,
                ocean: proposal.grantedToken,
            } as Funding;

            delete proposal.votes;
            delete proposal.counterVotes;
            delete proposal.requestedGrantUsd;
            delete proposal.requestedGrantToken;
            delete proposal.grantedUsd;
            delete proposal.grantedToken;
            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        votes: 1,
                        counterVotes: 1,
                        requestedGrantUsd: 1,
                        requestedGrantToken: 1,
                        grantedUsd: 1,
                        grantedToken: 1,
                    },
                },
                { strict: false },
            );
        }

        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find().lean();

        for (let round of rounds) {
            round.availableFunding = {
                usd: round.availableFundingUsd,
                ocean: round.availableFundingOcean,
            } as Funding;
            round.maxGrant = {
                usd: round.maxGrantUsd,
                ocean: round.maxGrantOcean,
            } as Funding;
            round.grantPools = round.earmarks;

            delete round.availableFundingUsd;
            delete round.availableFundingOcean;
            delete round.maxGrantUsd;
            delete round.maxGrantOcean;
            delete round.earmarks;
            await roundModel.updateOne(
                { id: round.id },
                {
                    $set: round,
                    $unset: {
                        availableFundingUsd: 1,
                        availableFundingOcean: 1,
                        maxGrantUsd: 1,
                        maxGrantOcean: 1,
                        earmarks: 1,
                    },
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const proposalModel = connection.model<any>('DaoProposal');
        const proposals = await proposalModel.find().lean();

        for (let proposal of proposals) {
            proposal.votes = proposal.yesVotes;
            proposal.counterVotes = proposal.noVotes;
            proposal.requestedGrantUsd = proposal.requestedFunding.usd;
            proposal.requestedGrantToken = proposal.requestedFunding.ocean;
            proposal.grantedUsd = proposal.receivedFunding.usd;
            proposal.grantedToken = proposal.receivedFunding.ocean;

            delete proposal.yesVotes;
            delete proposal.noVotes;
            delete proposal.requestedFunding;
            delete proposal.receivedFunding;
            await proposalModel.updateOne(
                { id: proposal.id },
                {
                    $set: proposal,
                    $unset: {
                        yesVotes: 1,
                        noVotes: 1,
                        requestedFunding: 1,
                        receivedFunding: 1,
                    },
                },
                { strict: false },
            );
        }

        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find().lean();

        for (let round of rounds) {
            round.availableFundingUsd = round.availableFunding.usd;
            round.availableFundingOcean = round.availableFunding.ocean;
            round.maxGrantUsd = round.maxGrant.usd;
            round.maxGrantOcean = round.maxGrant.ocean;
            round.earmarks = round.grantPools;

            delete round.availableFunding;
            delete round.maxGrant;
            delete round.grantPools;
            await roundModel.updateOne(
                { id: round.id },
                {
                    $set: round,
                    $unset: {
                        availableFunding: 1,
                        maxGrant: 1,
                        grantPools: 1,
                    },
                },
                { strict: false },
            );
        }
    }
}
