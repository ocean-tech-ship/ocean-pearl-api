import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PostFilterQuery {
    @ApiPropertyOptional({
        description: 'The Title of the Project',
        type: String,
    })
    @IsOptional()
    @IsString()
    project: string;

    @ApiPropertyOptional({
        description: 'The Title of the Post',
        type: String,
    })
    @IsOptional()
    @IsString()
    search: string;

    @ApiPropertyOptional({
        description: 'The current page',
        type: Number,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiPropertyOptional({
        description: 'Amount of Posts per page',
        type: Number,
        default: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number;
}
