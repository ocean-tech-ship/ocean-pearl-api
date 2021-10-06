import { Module } from '@nestjs/common';
import { PicturesService } from './services/pictures.service';

@Module({
    providers: [PicturesService],
    exports: [PicturesService],
})
export class UtilsModule {}
