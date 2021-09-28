import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../../database/database.module';
import { ProjectsController } from '../../../projects.controller';
import { ProjectsModule } from '../../../projects.module';

describe('ProjectsController', () => {
    let module: TestingModule;
    let controller: ProjectsController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ProjectsModule, AppModule, DatabaseModule],
            controllers: [ProjectsController],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
