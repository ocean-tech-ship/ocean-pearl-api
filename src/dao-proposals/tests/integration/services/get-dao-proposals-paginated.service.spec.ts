import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { GetProjectsPaginatedService } from '../../../../projects/services/get-projects-paginated.service';
import { DaoProposalsModule } from '../../../dao-proposals.module';

describe('GetProjectsPaginatedService', () => {
    let module: TestingModule;
    let service: GetProjectsPaginatedService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, DaoProposalsModule, AppModule],
        }).compile();

        service = module.get<GetProjectsPaginatedService>(
            GetProjectsPaginatedService,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
