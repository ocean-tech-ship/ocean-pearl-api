import { Injectable } from '@nestjs/common';
import { PictureData } from '../models/pictures.model';
import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';
import { optimize } from 'svgo';
import * as sharp from 'sharp';
import { MimeTypesMap } from '../../aws/s3/constants/mime-types-map.const';

@Injectable()
export class PicturesService {
    public async optimizeLogo(input: PictureData): Promise<PictureData> {
        if (input.type === MimeTypesEnum.Svg) {
            return await this.optimizeSvg(input);
        }

        const response = await sharp(input.data)
            .resize(64)
            .jpeg({ progressive: true, force: false })
            .png({ progressive: true, force: false })
            .toBuffer({ resolveWithObject: true });

        return {
            data: response.data,
            type: MimeTypesMap[response.info.format],
            width: response.info.width,
            height: response.info.height,
            size: response.info.size,
        };
    }

    public async optimizeGalleryImage(
        input: PictureData,
    ): Promise<PictureData> {
        if (input.type === MimeTypesEnum.Svg) {
            return await this.optimizeSvg(input);
        }

        const response = await sharp(input.data)
            .jpeg({ progressive: true, force: false })
            .png({ progressive: true, force: false })
            .toBuffer({ resolveWithObject: true });

        return {
            data: response.data,
            type: MimeTypesMap[response.info.format],
            width: response.info.width,
            height: response.info.height,
            size: response.info.size,
        };
    }

    public async optimizeSvg(input: PictureData): Promise<PictureData> {
        const response = await optimize(input.data);

        return {
            data: Buffer.from(response.data),
            type: MimeTypesEnum.Svg,
            width: Number.parseInt(response.info.width),
            height: Number.parseInt(response.info.height),
            size: Buffer.byteLength(response.data),
        };
    }
}
