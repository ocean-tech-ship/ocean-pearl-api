import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { GetAssociatedProjectsService } from '../../../services/get-associated-projects.service';

describe('GetAssociatedProjectsService', () => {
    let service: GetAssociatedProjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<GetAssociatedProjectsService>(
            GetAssociatedProjectsService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
