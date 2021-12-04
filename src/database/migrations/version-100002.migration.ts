import { Connection } from 'mongoose';
import { EarmarkTypeMap } from '../../airtable/constants/earmark-type-map.constant';
import { EarmarkTypeEnum } from '../enums/earmark-type.enum';
import { MigrationInterface } from '../interfaces/migration.interface';
import { Earmark } from '../schemas/earmark.schema';

export default class Version100002 implements MigrationInterface {
    public getVersion(): number {
        // count this number up with each migration
        return 100002;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Remove earmark fields and add an earmark array to rounds';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const roundModel = connection.model<any>('Round');
        const rounds = await roundModel.find().lean();

        for (let round of rounds) {
            round.earmarks = {};
            round.earmarks[EarmarkTypeEnum.NewEntrants] = {
                type: EarmarkTypeEnum.NewEntrants,
                fundingOcean: round.earmarkedFundingOcean,
                fundingUsd: round.earmarkedFundingUsd,
            } as Earmark;

            delete round.earmarkedFundingOcean;
            delete round.earmarkedFundingUsd;
            await roundModel.updateOne(
                { id: round.id },
                {
                    $set: round,
                    $unset: {
                        earmarkedFundingOcean: 1,
                        earmarkedFundingUsd: 1,
                    },
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        throw new Error(`Can\'t revert migration ${this.getVersion}!`);
    }
}
