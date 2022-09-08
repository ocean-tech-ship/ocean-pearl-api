import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AwsModule } from '../aws/aws.module';
import { DatabaseModule } from '../database/database.module';
import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { ProjectGuard } from './guards/project.guard';
import { ManagedProjectMapper } from './mapper/managed-project.mapper';
import { GetAssociatedProjectsService } from './services/get-associated-projects.service';
import { UpdateProjectService } from './services/update-project.service';
import { ImageUtilsModule } from '../utils/image/image-utils.module';
import { ImageUploadService } from './services/image-upload.service';
import { ImageController } from './controllers/image.controller';
import { CreateProjectService } from './services/create-project.service';
import { ProjectCreationGuard } from './guards/project-creation.guard';
import { ImageOptimizationService } from '../utils/image/services/image-optimization.service';
import { WalletUtilsModule } from '../utils/wallet/wallet-utils.module';
import { CreatePostService } from './services/create-post.service';
import { WalletInfoInterceptor } from './interceptor/wallet-info.interceptor';
import { PostController } from './controllers/post.controller';

@Module({
    imports: [AuthModule, DatabaseModule, AwsModule, ImageUtilsModule, WalletUtilsModule],
    controllers: [AccountController, AuthController, ImageController, PostController],
    providers: [
        GetAssociatedProjectsService,
        ManagedProjectMapper,
        UpdateProjectService,
        CreateProjectService,
        ProjectGuard,
        ProjectCreationGuard,
        ImageOptimizationService,
        ImageUploadService,
        CreatePostService,
        WalletInfoInterceptor,
    ],
})
export class AccountModule {}
