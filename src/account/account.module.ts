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

@Module({
    imports: [AuthModule, DatabaseModule, AwsModule],
    controllers: [AccountController, AuthController],
    providers: [
        GetAssociatedProjectsService,
        ManagedProjectMapper,
        UpdateProjectService,
        ProjectGuard,
    ],
})
export class AccountModule {}
