import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectGuard } from '../../../guards/project.guard';

describe('ProjectGuard', () => {
    let service: ProjectGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<ProjectGuard>(ProjectGuard);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
