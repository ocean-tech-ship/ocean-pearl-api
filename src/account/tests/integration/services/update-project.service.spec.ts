import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { UpdateProjectService } from '../../../services/update-project.service';

describe('UpdateProjectService', () => {
    let module: TestingModule;
    let service: UpdateProjectService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<UpdateProjectService>(UpdateProjectService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
