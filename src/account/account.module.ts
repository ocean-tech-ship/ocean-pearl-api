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
import { UtilsModule } from '../utils/utils.module';
import { ImageOptimizationService } from '../utils/services/image-optimization.service';
import { ImageUploadService } from './services/image-upload.service';
import { ImageController } from './controllers/image.controller';
import { ProjectCreationGuard } from './guards/project-creation.guard';

@Module({
    imports: [AuthModule, DatabaseModule, AwsModule, UtilsModule],
    controllers: [AccountController, AuthController, ImageController],
    providers: [
        GetAssociatedProjectsService,
        ManagedProjectMapper,
        UpdateProjectService,
        ProjectGuard,
        ProjectCreationGuard,
        ImageOptimizationService,
        ImageUploadService,
    ],
})
export class AccountModule {}
