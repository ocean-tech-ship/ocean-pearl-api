import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { AccountController } from '../../controllers/account.controller';
import { ProjectGuard } from '../../guards/project.guard';
import { ManagedProjectMapper } from '../../mapper/managed-project.mapper';
import { GetAssociatedProjectsService } from '../../services/get-associated-projects.service';
import { UpdateProjectService } from '../../services/update-project.service';

describe('AccountController', () => {
    let module: TestingModule;
    let controller: AccountController;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule],
            controllers: [AccountController],
            providers: [
                GetAssociatedProjectsService,
                UpdateProjectService,
                ManagedProjectMapper,
                ProjectGuard,
            ],
        }).compile();

        controller = module.get<AccountController>(AccountController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
