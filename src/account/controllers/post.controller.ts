import {
    Body,
    Controller,
    Delete,
    Injectable,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Post as ProjectPost } from '../../database/schemas/post.schema';
import { WalletInfoParam } from '../../utils/wallet/decorators/wallet-info-parameter.decorator';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { PostParam } from '../decorators/post-parameter.decorator';
import { PostGuard } from '../guards/post.guard';
import { WalletInfoInterceptor } from '../interceptors/wallet-info.interceptor';
import { NewPost } from '../models/new-post.model';
import { CreatePostService } from '../services/create-post.service';
import { DeletePostService } from '../services/delete-post.service';

@ApiTags('posts')
@UseGuards(AuthGuard('jwt-refresh'))
@Controller('account')
@Injectable()
export class PostController {
    public constructor(
        private createPostService: CreatePostService,
        private deletePostService: DeletePostService,
    ) {}

    @Post('posts')
    @ApiBody({
        type: NewPost,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseInterceptors(WalletInfoInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    public async create(
        @Body() post: NewPost,
        @WalletInfoParam() walletInfo: WalletInfo,
    ): Promise<void> {
        try {
            await this.createPostService.execute(post, walletInfo);
        } catch (error) {
            throw error;
        }
    }

    @Delete('posts/:id')
    @ApiParam({
        name: 'id',
        type: String,
    })
    @ApiOkResponse({ description: 'Ok.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(PostGuard)
    public async getLinkedPost(@PostParam() post: ProjectPost): Promise<void> {
        try {
            await this.deletePostService.execute(post);
        } catch (error) {
            throw error;
        }
    }
}
