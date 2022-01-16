import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalDocs: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    nextPage: number;

    @ApiProperty()
    prevPage: number;

    @ApiProperty()
    pagingCounter: number;
    
    @ApiProperty()
    hasPrevPage: boolean;

    @ApiProperty()
    hasNextPage: boolean;
}