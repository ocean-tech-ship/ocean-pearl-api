import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProjectsController } from './projects.controller';
import { DaoFeaturedProjectsService } from './services/dao-featured-projects.service';
import { FeaturedProjectsService } from './services/featured-projects.service';
import { GetProjectByIdService } from './services/get-project-by-id.service';
import { GetProjectsService } from './services/get-projects.service';
import { LatestProjectsService } from './services/latest-projects.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [
      DaoFeaturedProjectsService,
      FeaturedProjectsService,
      GetProjectByIdService,
      GetProjectsService,
      LatestProjectsService,
  ],
  exports: [
    DaoFeaturedProjectsService,
    FeaturedProjectsService,
    GetProjectByIdService,
    GetProjectsService,
    LatestProjectsService,
]
})
export class ProjectsModule {}
