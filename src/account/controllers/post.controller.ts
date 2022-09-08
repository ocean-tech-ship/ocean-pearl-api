import {
    Body,
    Controller,
    Injectable,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { WalletInfoParam } from '../../utils/wallet/decorators/wallet-info-parameter.decorator';
import { WalletInfo } from '../../utils/wallet/models/wallet-info.model';
import { WalletInfoInterceptor } from '../interceptors/wallet-info.interceptor';
import { NewPost } from '../models/new-post.model';
import { CreatePostService } from '../services/create-post.service';

@ApiTags('posts')
@UseGuards(AuthGuard('jwt-refresh'))
@Controller('account')
@Injectable()
export class PostController {
    public constructor(private createPostService: CreatePostService) {}

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
            this.createPostService.execute(post, walletInfo);
        } catch (error) {
            throw error;
        }
    }
}
