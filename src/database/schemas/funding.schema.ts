import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Funding {
    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    usd: number = 0;

    @Prop({
        type: Number,
        min: 0,
        default: 0,
    })
    @ApiProperty()
    ocean: number = 0;

    public constructor(attributes: Partial<Funding> = {}) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }

    public addFunding(funding: Funding): void {
        this.usd += funding.usd;
        this.ocean += funding.ocean;
    }

    public substractFunding(funding: Funding): void {
        this.usd -= funding.usd;
        this.ocean -= funding.ocean;
    }
}

export const FundingSchema = SchemaFactory.createForClass(Funding);
