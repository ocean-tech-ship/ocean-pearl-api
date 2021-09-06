import { FileExtensionsEnum } from '../enums/file-extensions.enum';
import { MimeTypesEnum } from '../enums/mime-types.enum';

export const FileExtensionsMap: { [key in MimeTypesEnum]: FileExtensionsEnum } = {
    [MimeTypesEnum.Jpe]: FileExtensionsEnum.Jpe,
    [MimeTypesEnum.Jpeg]: FileExtensionsEnum.Jpeg,
    [MimeTypesEnum.Jpg]: FileExtensionsEnum.Jpg,
    [MimeTypesEnum.Png]: FileExtensionsEnum.Png,
    [MimeTypesEnum.Svg]: FileExtensionsEnum.Svg,
};