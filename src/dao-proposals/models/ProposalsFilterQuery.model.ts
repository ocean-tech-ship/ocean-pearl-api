import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';

export class ProposalsFilterQuery {
    @ApiPropertyOptional({
        description: 'The Round, 0 for the current Round',
        type: Number,
        default: 0,
    })
    @IsOptional()
    @IsNumberString()
    round: number;

    @ApiPropertyOptional({ 
        enum: CategoryEnum,
        enumName: 'Category'
    })
    @IsOptional()
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiPropertyOptional({
        description: 'The Title of the Proposal',
        type: String
    })
    @IsOptional()
    @IsString()
    search: string;
}
