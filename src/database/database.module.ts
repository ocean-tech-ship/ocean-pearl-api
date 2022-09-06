import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DaoProposalRepository } from './repositories/dao-proposal.repository';
import { DeliverableRepository } from './repositories/deliverable.repository';
import { ProjectRepository } from './repositories/project.repository';
import { RoundRepository } from './repositories/round.repository';
import { DaoProposalSchema } from './schemas/dao-proposal.schema';
import { DeliverableSchema } from './schemas/deliverable.schema';
import { ProjectSchema } from './schemas/project.schema';
import { RoundSchema } from './schemas/round.schema';
import { SessionSchema } from './schemas/session.schema';
import { SessionRepository } from './repositories/session.repository';
import { MigrationSchema } from './schemas/migration.schema';
import { MigrationService } from './services/migrations.service';
import { ImageSchema } from './schemas/image.schema';
import { ImageRepository } from './repositories/image.repository';
import { UpdateSchema } from './schemas/update.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'DaoProposal', schema: DaoProposalSchema },
            { name: 'Deliverable', schema: DeliverableSchema },
            { name: 'Image', schema: ImageSchema },
            { name: 'Project', schema: ProjectSchema },
            { name: 'Update', schema: UpdateSchema },
            { name: 'Round', schema: RoundSchema },
            { name: 'Session', schema: SessionSchema },
            { name: 'Migration', schema: MigrationSchema },
        ]),
    ],
    providers: [
        DaoProposalRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
        MigrationService,
        ImageRepository
    ],
    exports: [
        DaoProposalRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
        ImageRepository
    ],
})
export class DatabaseModule {}
