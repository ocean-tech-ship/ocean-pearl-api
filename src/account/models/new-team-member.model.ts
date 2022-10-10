import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { MediaHandlesEnum } from '../../database/enums/media-handles.enum';

export class NewTeamMember {
    @ApiProperty({
        default: 'Add the member\'s name.',
    })
    @IsString()
    @Length(0, 128)
    name: string;

    @ApiProperty({
        default: 'project lead',
        description: 'Add a role (at least one must be \'project lead\').'
    })
    @IsString()
    @Length(0, 128)
    role: string;

    @ApiProperty({
        default: 'Add an affiliation.',
    })
    @IsOptional()
    @IsString()
    @Length(0, 128)
    affiliation: string;

    @ApiProperty({
        type: Object,
        additionalProperties: {
            type: 'string' ,
        },
        default: {
            [MediaHandlesEnum.Twitter]: 'Oceanpearl.io',
        },
    })
    @Type(() => String)
    @MaxLength(128, {
        each: true,
    })
    @IsOptional()
    mediaHandles: Map<MediaHandlesEnum, string>;

    @ApiProperty({
        default: 'Short description of the background.',
    })
    @IsString()
    @Length(0, 2048)
    @IsOptional()
    background: string;
}