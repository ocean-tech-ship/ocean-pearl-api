import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DaoProposalRepository } from './repositories/dao-proposal.repository';
import { DeliverableRepository } from './repositories/deliverable.repository';
import { ImageRepository } from './repositories/image.repository';
import { ProjectRepository } from './repositories/project.repository';
import { RoundRepository } from './repositories/round.repository';
import { SessionRepository } from './repositories/session.repository';
import { PostRepository } from './repositories/post.repository';
import { DaoProposal, DaoProposalSchema } from './schemas/dao-proposal.schema';
import { Deliverable, DeliverableSchema } from './schemas/deliverable.schema';
import { Image, ImageSchema } from './schemas/image.schema';
import { Migration, MigrationSchema } from './schemas/migration.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Round, RoundSchema } from './schemas/round.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { MigrationService } from './services/migrations.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DaoProposal.name, schema: DaoProposalSchema },
            { name: Deliverable.name, schema: DeliverableSchema },
            { name: Image.name, schema: ImageSchema },
            { name: Project.name, schema: ProjectSchema },
            { name: Post.name, schema: PostSchema },
            { name: Round.name, schema: RoundSchema },
            { name: Session.name, schema: SessionSchema },
            { name: Migration.name, schema: MigrationSchema },
        ]),
    ],
    providers: [
        DaoProposalRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
        MigrationService,
        ImageRepository,
        PostRepository,
    ],
    exports: [
        DaoProposalRepository,
        ProjectRepository,
        RoundRepository,
        DeliverableRepository,
        SessionRepository,
        ImageRepository,
        PostRepository,
    ],
})
export class DatabaseModule {}
