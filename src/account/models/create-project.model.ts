import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, Length, MaxLength, ValidateNested } from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';
import { CreateCryptoAddress } from './create-crypto-address.model';
import { CreateTeamMember } from './create-team-member.model';

export class CreateProject {
    @ApiProperty({
        default: 'Add the project\'s name.',
    })
    @IsString()
    @Length(0, 64)
    name: string;

    @ApiProperty({
        default: 'Add a oneliner.',
    })
    @IsString()
    @Length(0, 128)
    oneLiner: string;

    @ApiProperty({
        default: 'Add a description.',
    })
    @IsString()
    @Length(0, 2048)
    description: string;

    @ApiProperty({
        enum: CategoryEnum,
        enumName: 'Category',
        default: CategoryEnum.Outreach,
    })
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiProperty({
        type: CreateCryptoAddress,
        isArray: true,
    })
    @IsArray()
    @ValidateNested()
    walletAddresses: CreateCryptoAddress[];

    @ApiProperty({
        type: CreateCryptoAddress,
    })
    @IsArray()
    @ValidateNested()
    paymentWalletAddresses: CreateCryptoAddress;

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
        type: CreateTeamMember,
        isArray: true,
    })
    @IsArray()
    @ValidateNested()
    team: CreateTeamMember[];
}
