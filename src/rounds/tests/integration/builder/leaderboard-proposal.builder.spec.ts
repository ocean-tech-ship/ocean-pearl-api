import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { ProjectRepository } from '../../../../database/repositories/project.repository';
import { Project } from '../../../../database/schemas/project.schema';
import { LeaderboardProposalBuilder } from '../../../builder/leaderboard-proposal.builder';

describe('LeaderboardProposalBuilder', () => {
    let module: TestingModule;
    let service: LeaderboardProposalBuilder;
    let projectRepository: ProjectRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<LeaderboardProposalBuilder>(
            LeaderboardProposalBuilder,
        );
        projectRepository = module.get<ProjectRepository>(ProjectRepository);
    });

    beforeEach(async () => {
        const mockResponse = { daoProposals: [] } as Project;
        jest.spyOn(projectRepository, 'findOneRaw').mockImplementation(
            async () => mockResponse,
        );
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
