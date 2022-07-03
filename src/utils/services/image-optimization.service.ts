import { Injectable } from '@nestjs/common';
import { ImageData } from '../models/image-data.model';
import { MimeTypesEnum } from '../../aws/s3/enums/mime-types.enum';
import { optimize, OptimizedSvg } from 'svgo';
import * as sharp from 'sharp';
import { MimeTypesMap } from '../../aws/s3/constants/mime-types-map.const';

@Injectable()
export class ImageOptimizationService {
    private readonly logoWidth: number = 64;

    public async optimizeImage(input: ImageData, isLogo?: boolean): Promise<ImageData> {
        if (input.type === MimeTypesEnum.Svg) {
            return await this.optimizeSvg(input);
        }

        const response = await sharp(input.data);

        if (isLogo) {
            await response.resize(this.logoWidth);
        }

        const imageData = await response
            .jpeg({ progressive: true, force: false })
            .png({ progressive: true, force: false })
            .toBuffer({ resolveWithObject: true });

        return {
            data: imageData.data,
            type: MimeTypesMap[imageData.info.format],
            width: imageData.info.width,
            height: imageData.info.height,
            size: imageData.info.size,
        };
    }

    public async optimizeSvg(input: ImageData): Promise<ImageData> {
        const response = (await optimize(input.data, {
            plugins: ['preset-default', 'removeScriptElement'],
        })) as OptimizedSvg;

        return {
            data: Buffer.from(response.data),
            type: MimeTypesEnum.Svg,
            width: Number.parseInt(response.info.width),
            height: Number.parseInt(response.info.height),
            size: Buffer.byteLength(response.data),
        };
    }
}
