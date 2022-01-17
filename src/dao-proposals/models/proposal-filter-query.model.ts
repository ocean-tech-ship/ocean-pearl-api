import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';

export class ProposalFilterQuery {
    @ApiPropertyOptional({
        description: 'The Round, 0 for the current Round',
        type: Number,
        default: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    round: number;

    @ApiPropertyOptional({
        enum: CategoryEnum,
        enumName: 'Category',
    })
    @IsOptional()
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiPropertyOptional({
        description: 'The Title of the Proposal',
        type: String,
    })
    @IsOptional()
    @IsString()
    search: string;

    @ApiPropertyOptional({
        description: 'The current page, starts at 1',
        type: Number,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiPropertyOptional({
        description: 'Amount of Proposals per page',
        type: Number,
        default: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number;
}
