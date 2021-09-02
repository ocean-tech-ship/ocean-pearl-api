import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AwsModule } from '../aws/aws.module';
import { S3ImageManagementService } from '../aws/s3/services/s3-image-management.service';
import { DatabaseModule } from '../database/database.module';
import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { ManagedProjectMapper } from './mapper/managed-project.builder';
import { GetAssociatedProjectsService } from './services/get-associated-projects.service';
import { UpdateProjectService } from './services/update-project.servce';

@Module({
    imports: [AuthModule, DatabaseModule, AwsModule],
    controllers: [AccountController, AuthController],
    providers: [
        GetAssociatedProjectsService,
        ManagedProjectMapper,
        UpdateProjectService,
        S3ImageManagementService,
    ],
})
export class AccountModule {}
