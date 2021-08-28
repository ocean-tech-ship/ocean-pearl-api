import { FileExtensionsEnum } from '../enums/file-extensions.enum';

export const MimeTypesMap: { [key in FileExtensionsEnum]: string } = {
    [FileExtensionsEnum.Jpeg]: 'image/jpeg',
    [FileExtensionsEnum.Jpg]: 'image/jpeg',
    [FileExtensionsEnum.Jpe]: 'image/jpeg',
    [FileExtensionsEnum.Png]: 'image/png',
    [FileExtensionsEnum.Svg]: 'image/svg+xml',
};
