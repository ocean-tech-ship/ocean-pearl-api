import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyRepository } from './repositories/company.repository';
import { DaoProposalRepository } from './repositories/dao-proposal.repository';
import { DeliverableRepository } from './repositories/deliverable.repository';
import { JobRepository } from './repositories/job.repository';
import { PearlUserRepository } from './repositories/pearl-user.repository';
import { ProjectRepository } from './repositories/project.repository';
import { RoundRepository } from './repositories/round.repository';
import { CompanySchema } from './schemas/company.schema';
import { DaoProposalSchema } from './schemas/dao-proposal.schema';
import { DeliverableSchema } from './schemas/deliverable.schema';
import { JobSchema } from './schemas/job.schema';
import { KpiTargetSchema } from './schemas/kpi-target.schema';
import { PearlUserSchema } from './schemas/pearl-user.schema';
import { ProjectSchema } from './schemas/project.schema';
import { RoundSchema } from './schemas/round.schema';
import { SessionSchema } from './schemas/session.schema';
import { SessionRepository } from './repositories/session.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Company', schema: CompanySchema },
            { name: 'DaoProposal', schema: DaoProposalSchema },
            { name: 'Deliverable', schema: DeliverableSchema },
            { name: 'Job', schema: JobSchema },
            { name: 'KpiTarget', schema: KpiTargetSchema },
            { name: 'PearlUser', schema: PearlUserSchema },
            { name: 'Project', schema: ProjectSchema },
            { name: 'Round', schema: RoundSchema },
            { name: 'Session', schema: SessionSchema },
        ]),
    ],
    providers: [
        CompanyRepository,
        DaoProposalRepository,
        JobRepository,
        PearlUserRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
    ],
    exports: [
        CompanyRepository,
        DaoProposalRepository,
        JobRepository,
        PearlUserRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
    ],
})
export class DatabaseModule {}
