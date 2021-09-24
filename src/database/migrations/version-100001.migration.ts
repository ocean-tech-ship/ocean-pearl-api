import { Connection } from 'mongoose';
import { PaymentOptionEnum } from '../enums/payment-option.enum';
import { MigrationInterface } from '../interfaces/migration.interface';

export default class Version100001 implements MigrationInterface {
    public getVersion(): number {
        // Acount this number up with each migration
        return 100001;
    }

    public getDescription(): string {
        // Add a short description of what will happen.
        return 'Remove the only availableFunding field and add two seperate for usd and ocean.'
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find();
        
        for (let round of rounds) {
            if (round.paymentOption === PaymentOptionEnum.Usd) {
                round.availableFundingUsd = round.availableFunding;
            } else {
                round.availableFundingOcean = round.availableFunding;
            }

            delete round.availableFunding;
            await roundModel.updateOne({ id: round.id }, round);
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find();
        
        for (let round of rounds) {
            round.availableFunding = 
                round.paymentOption === PaymentOptionEnum.Usd
                ? round.availableFundingUsd
                : round.availableFundingOcean;

            delete round.availableFundingUsd;
            delete round.availableFundingOcean;
            await roundModel.updateOne({ id: round.id }, round);
        }
    }
}
