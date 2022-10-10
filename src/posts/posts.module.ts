import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PostsController } from './controllers/posts.controller';
import { GetPostsService } from './services/get-posts.service';
import { GetPostByIdService } from './services/get-post-by-id.service';
import { LatestPostsService } from './services/latest-posts.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PostsController],
    providers: [GetPostsService, GetPostByIdService, LatestPostsService],
    exports: [LatestPostsService],
})
export class PostsModule {}
