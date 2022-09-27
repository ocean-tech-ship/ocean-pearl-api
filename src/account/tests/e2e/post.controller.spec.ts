import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { ImageUtilsModule } from '../../../utils/image/image-utils.module';
import { WalletUtilsModule } from '../../../utils/wallet/wallet-utils.module';
import { PostController } from '../../controllers/post.controller';
import { WalletInfoInterceptor } from '../../interceptors/wallet-info.interceptor';
import { CreatePostService } from '../../services/create-post.service';
import { DeletePostService } from '../../services/delete-post.service';

describe('PostController', () => {
    let module: TestingModule;
    let controller: PostController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule, ImageUtilsModule, WalletUtilsModule],
            controllers: [PostController],
            providers: [CreatePostService, WalletInfoInterceptor, DeletePostService],
        }).compile();

        controller = module.get<PostController>(PostController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
