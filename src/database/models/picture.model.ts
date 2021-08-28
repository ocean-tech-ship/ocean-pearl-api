import { ApiProperty } from '@nestjs/swagger';
import { FileExtensionsEnum } from '../../aws/s3/enums/file-extensions.enum';

export class Picture {

    @ApiProperty()
    key: string;
    
    @ApiProperty()
    url: string;

    @ApiProperty()
    fileExtension: FileExtensionsEnum;
}