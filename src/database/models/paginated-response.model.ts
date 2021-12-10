import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from './pagination.model';

export class PaginatedResponse<T> {
    @ApiProperty({
        isArray: true
    })
    docs: T[];

    @ApiProperty({
        type: Pagination
    })
    pagination: Pagination;
}

