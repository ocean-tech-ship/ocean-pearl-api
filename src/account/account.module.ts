import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';
import { ImageUtilsModule } from '../utils/image/image-utils.module';
import { ImageOptimizationService } from '../utils/image/services/image-optimization.service';
import { WalletUtilsModule } from '../utils/wallet/wallet-utils.module';
import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { ImageController } from './controllers/image.controller';
import { PostController } from './controllers/post.controller';
import { PostGuard } from './guards/post.guard';
import { ProjectCreationGuard } from './guards/project-creation.guard';
import { ProjectGuard } from './guards/project.guard';
import { WalletInfoInterceptor } from './interceptors/wallet-info.interceptor';
import { LinkedProjectMapper } from './mapper/linked-project.mapper';
import { CreatePostService } from './services/create-post.service';
import { CreateProjectService } from './services/create-project.service';
import { DeletePostService } from './services/delete-post.service';
import { GetLinkedProjectsService } from './services/get-linked-projects.service';
import { ImageUploadService } from './services/image-upload.service';
import { UpdateProjectService } from './services/update-project.service';

@Module({
    imports: [AuthModule, DatabaseModule, AwsModule, ImageUtilsModule, WalletUtilsModule],
    controllers: [AccountController, AuthController, ImageController, PostController],
    providers: [
        GetLinkedProjectsService,
        LinkedProjectMapper,
        UpdateProjectService,
        CreateProjectService,
        ProjectGuard,
        ProjectCreationGuard,
        ImageOptimizationService,
        ImageUploadService,
        CreatePostService,
        WalletInfoInterceptor,
        DeletePostService,
        PostGuard,
    ],
})
export class AccountModule {}
