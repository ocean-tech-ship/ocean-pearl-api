import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { UpdateProjectService } from '../../../services/update-project.service';

describe('UpdateProjectService', () => {
    let service: UpdateProjectService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<UpdateProjectService>(UpdateProjectService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
