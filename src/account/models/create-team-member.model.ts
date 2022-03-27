import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateTeamMember {
    @ApiProperty({
        default: 'Add the meber\'s name.',
    })
    @IsString()
    @Length(0, 128)
    name: string;

    @ApiProperty({
        default: 'Add a role (at least one must be \'project lead\').',
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
        type: () => new Map<string, string>(),
        default: {
            Oceanpearl: 'Oceanpearl.io',
        },
    })
    @MaxLength(128, {
        each: true,
      })
    @IsOptional()
    links: Map<string, string>;

    @ApiProperty({
        default: 'Add the project name.',
    })
    @IsString()
    @Length(0, 2048)
    background: string;
}