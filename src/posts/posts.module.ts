import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PostsController } from './controllers/posts.controller';
import { GetPostsService } from './services/get-posts.service';

@Module({
    imports: [DatabaseModule],
    controllers: [PostsController],
    providers: [GetPostsService],
})
export class PostsModule {}
