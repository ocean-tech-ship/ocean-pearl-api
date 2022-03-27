import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class TeamMember {
    @Prop({
        type: String,
        length: 128,
        required: true
    })
    @ApiProperty()
    name: string;

    @Prop({
        type: String,
        length: 128,
    })
    @ApiProperty()
    role: string;

    @Prop({
        type: String,
        length: 128,
    })
    @ApiProperty()
    affiliation: string;

    @Prop({
        type: () => new Map<string, string>()
    })
    @ApiProperty()
    links: Map<string, string>;

    @Prop({
        type: String,
        length: 2048,
    })
    @ApiProperty()
    background: string;

    public constructor(attributes: Partial<TeamMember> = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
