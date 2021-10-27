import { Connection } from 'mongoose';
import { PaymentOptionEnum } from '../enums/payment-option.enum';
import { MigrationInterface } from '../interfaces/migration.interface';

export default class Version100001 implements MigrationInterface {
    public getVersion(): number {
        // count this number up with each migration
        return 100001;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Remove the availableFunding field and add two seperate for usd and ocean.';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find().lean();

        for (let round of rounds) {
            if (round.paymentOption === PaymentOptionEnum.Usd) {
                round.availableFundingUsd = round.availableFunding;
                round.earmarkedFundingUsd = round.earmarked;
                round.maxGrantUsd = round.maxGrant;
            } else {
                round.availableFundingOcean = round.availableFunding;
                round.earmarkedFundingOcean = round.earmarked;
                round.maxGrantOcean = round.maxGrant;
            }

            delete round.availableFunding;
            delete round.earmarked;
            delete round.maxGrant;
            await roundModel.updateOne(
                { id: round.id },
                {
                    $set: round,
                    $unset: { availableFunding: 1, earmarked: 1, maxGrant: 1 },
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find().lean();

        for (let round of rounds) {
            if (round.paymentOption === PaymentOptionEnum.Usd) {
                round.availableFunding = round.availableFundingUsd;
                round.earmarked = round.earmarkedFundingUsd;
                round.maxGrant = round.maxGrantUsd;
            } else {
                round.availableFunding = round.availableFundingOcean;
                round.earmarked = round.earmarkedFundingOcean;
                round.maxGrant = round.maxGrantOcean;
            }

            delete round.availableFundingUsd;
            delete round.availableFundingOcean;
            delete round.earmarkedFundingUsd;
            delete round.earmarkedFundingOcean;
            delete round.maxGrantUsd;
            delete round.maxGrantOcean;
            delete round.usdConversionRate;
            await roundModel.updateOne(
                { id: round.id },
                {
                    $set: round,
                    $unset: {
                        availableFundingUsd: 1,
                        availableFundingOcean: 1,
                        earmarkedFundingUsd: 1,
                        earmarkedFundingOcean: 1,
                        maxGrantUsd: 1,
                        maxGrantOcean: 1,
                        usdConversionRate: 1,
                    },
                },
                { strict: false },
            );
        }
    }
}