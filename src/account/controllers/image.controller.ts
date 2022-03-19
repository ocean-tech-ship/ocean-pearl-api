import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AssociatedImage } from '../models/associated-project.model';
import { ImageUploadService } from '../services/image-upload.service';
import { UpdateProjectService } from '../services/update-project.service';

@ApiTags('account')
@UseGuards(AuthGuard('jwt-refresh'))
@Controller('account')
export class ImageController {
    public constructor(private imageUploadService: ImageUploadService) {}

    @Post('logos')
    @ApiCreatedResponse({ description: 'Ok.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                logo: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('logo', {
            limits: {
                fileSize: 4000000,
            },
        }),
    )
    public async uploadLogo(@UploadedFile() logo: Express.Multer.File): Promise<AssociatedImage> {
        try {
            return await this.imageUploadService.execute(logo, true);
        } catch (error) {
            throw error;
        }
    }

    @Post('images')
    @ApiCreatedResponse({ description: 'Ok.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'images',
                    maxCount: UpdateProjectService.MAX_PICTURES_AMOUNT,
                },
            ],
            {
                limits: {
                    fileSize: 4000000,
                },
            },
        ),
    )
    public async uploadImage(
        @UploadedFiles() files: { images: Array<Express.Multer.File> },
    ): Promise<AssociatedImage[]> {
        try {
            const savedImages: AssociatedImage[] = [];

            for (const image of files.images) {
                savedImages.push(await this.imageUploadService.execute(image));
            }

            return savedImages;
        } catch (error) {
            throw error;
        }
    }
}
