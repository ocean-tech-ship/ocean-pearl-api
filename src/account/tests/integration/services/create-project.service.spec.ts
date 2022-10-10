import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ImageUtilsModule } from '../../../../utils/image/image-utils.module';
import { CreateProjectService } from '../../../services/create-project.service';

describe('CreateProjectService', () => {
    let module: TestingModule;
    let service: CreateProjectService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule, ImageUtilsModule],
        }).compile();

        service = module.get<CreateProjectService>(CreateProjectService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
