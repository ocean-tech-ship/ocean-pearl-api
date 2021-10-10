import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MigrationStatusEnum } from '../enums/migration-status.enum';

@Schema({ timestamps: true })
export class Migration {
    _id: Types.ObjectId;

    @Prop({
        type: Number,
        maxLength: 32,
        required: true,
    })
    version: number;

    @Prop({
        type: String,
        enum: MigrationStatusEnum,
    })
    status: MigrationStatusEnum;
    
    createdAt: Date;

    updatedAt: Date;
}

export const MigrationSchema = SchemaFactory.createForClass(Migration);