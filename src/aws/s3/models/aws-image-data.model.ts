import { FileExtensionsEnum } from '../enums/file-extensions.enum';

export interface AwsImageDataProperties {
    id?: string,
    fileExtension?: FileExtensionsEnum,
    url?: string,
}

export class AwsImageData {
    id: string;

    fileExtension: FileExtensionsEnum;
    
    url: string
    
    constructor(attributes: AwsImageDataProperties = {}) {
        for (let key in attributes) {
            this[key] = attributes[key];
        }
    }
}