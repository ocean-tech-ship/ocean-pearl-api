import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class LeaderboardFilterQuery {
    @ApiPropertyOptional({
        description: 'Must at least be 6, omit for the current round'
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(6)
    round: number;
}