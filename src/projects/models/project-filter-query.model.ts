import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../../database/enums/category.enum';

export class ProjectFilterQuery {
    @ApiPropertyOptional({
        enum: CategoryEnum,
        enumName: 'Category',
    })
    @IsOptional()
    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    @ApiPropertyOptional({
        description: 'The Title of the Project',
        type: String,
    })
    @IsOptional()
    @IsString()
    search: string;

    @ApiPropertyOptional({
        description: 'The current page',
        type: Number,
        default: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
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
