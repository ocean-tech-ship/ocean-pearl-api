import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
}
