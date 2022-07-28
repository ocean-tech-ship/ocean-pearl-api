import { CanActivate, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from 'nanoid';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { AwsModule } from '../../../aws/aws.module';
import { DatabaseModule } from '../../../database/database.module';
import { ImageAssociationService } from '../../../utils/image/services/image-association.service';
import { WalletUtilsModule } from '../../../utils/wallet/wallet-utils.module';
import { AccountController } from '../../controllers/account.controller';
import { ProjectGuard } from '../../guards/project.guard';
import { ManagedProjectMapper } from '../../mapper/managed-project.mapper';
import { AssociatedImage } from '../../models/associated-project.model';
import { UpdatedProject } from '../../models/updated-project.model';
import { CreateProjectService } from '../../services/create-project.service';
import { GetAssociatedProjectsService } from '../../services/get-associated-projects.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { UpdateProjectService } from '../../services/update-project.service';

describe('AccountController', () => {
    let app: INestApplication;
    let module: TestingModule;

    let controller: AccountController;

    beforeAll(async () => {
        const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, AwsModule, WalletUtilsModule],
            controllers: [AccountController],
            providers: [
                GetAssociatedProjectsService,
                ImageAssociationService,
                UpdateProjectService,
                CreateProjectService,
                ManagedProjectMapper,
                ProjectGuard,
            ],
        })
            .overrideGuard(AuthGuard('jwt-refresh'))
            .useValue(mockGuard)
            .overrideGuard(ProjectGuard)
            .useValue(mockGuard)
            .compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        controller = module.get<AccountController>(AccountController);
    });

    afterAll(async () => {
        await app.close();
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should throw bad request if image amount is exceeded', async () => {
        const images = [];
        for (let i = 0; i < ImageUploadService.IMAGE_MAX_AMOUNT + 1; i++) {
            images.push({} as AssociatedImage);
        }

        const body = {
            id: nanoid(),
            images,
        } as UpdatedProject;

        const response = await request(app.getHttpServer()).put('/account/projects').send(body);
        expect(response.status).toBe(400);
    });
});
