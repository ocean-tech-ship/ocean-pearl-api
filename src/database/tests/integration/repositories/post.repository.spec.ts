import { Test, TestingModule } from '@nestjs/testing';
import { Wallet } from 'ethers';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { nanoid } from '../../../functions/nano-id.function';
import { PostRepository } from '../../../repositories/post.repository';
import { Post } from '../../../schemas/post.schema';

const POST_ID: string = nanoid();
const POST_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('PostRepository', () => {
    const post: Post = new Post({
        _id: POST_MONGO_ID,
        id: POST_ID,
        project: new Types.ObjectId(),
        author: Wallet.createRandom().address,
        title: 'Test title',
        text: 'This is a test text.',
        images: [new Types.ObjectId(), new Types.ObjectId()],
    });

    let module: TestingModule;
    let service: PostRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<PostRepository>(PostRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: POST_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a post repository', () => {
        test('it should save a post', async () => {
            expect(await service.create(post)).toEqual(POST_MONGO_ID);
        });

        test('it should return a post', async () => {
            const dbPost = await service.getByID(post.id);

            expect({
                id: dbPost.id,
                title: dbPost.title,
                text: dbPost.text,
                author: dbPost.author,
            }).toEqual({
                id: POST_ID,
                title: 'Test title',
                text: 'This is a test text.',
                author: post.author,
            });
        });

        test('it should return all posts', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a post', async () => {
            post.title = 'UpdateTest';

            expect(await service.update(post)).toBeTruthy();
        });

        test('it should delete a post', async () => {
            expect(await service.delete({ find: { id: post.id } })).toBeTruthy();
        });
    });
});
