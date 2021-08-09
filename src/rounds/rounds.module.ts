import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GetCurrentRoundService } from './services/get-current-round.service';
import { GetRoundsAmountService } from './services/get-rounds-amount.service';

@Module({
    imports: [DatabaseModule],
    providers: [GetCurrentRoundService, GetRoundsAmountService],
    exports: [GetCurrentRoundService, GetRoundsAmountService],
})
export class RoundsModule {}
