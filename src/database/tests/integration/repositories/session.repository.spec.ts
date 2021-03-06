import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../../database.module';
import { AppModule } from '../../../../app.module';
import { SessionRepository } from '../../../repositories/session.repository';
import { Session } from '../../../schemas/session.schema';
import { Wallet } from 'ethers';

describe('SessionRepository', () => {
    let module: TestingModule;
    let service: SessionRepository;

    let identity: Wallet;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<SessionRepository>(SessionRepository);

        identity = Wallet.createRandom();
    });

    afterAll(async () => {
        await service.deleteMany({
            find: { walletAddress: identity.address },
        });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be created', async () => {
        const session: Session | any = {
            walletAddress: identity.address,
            hashedToken: 'HASHED_TOKEN',
            createdAt: new Date(),
        };

        await service.create(session);

        expect(
            (
                await service.getAll({
                    find: { walletAddress: identity.address },
                })
            ).length,
        ).toBeGreaterThanOrEqual(1);

        expect(
            (
                await service.findOne({
                    find: {
                        walletAddress: session.walletAddress,
                        createdAt: session.createdAt,
                    },
                })
            ).hashedToken,
        ).toBe(session.hashedToken);
    });

    it('should be deleted', async () => {
        const session: Session = <Session>{
            createdAt: new Date(),
            walletAddress: identity.address,
            hashedToken: 'HASHED_TOKEN_2',
        };

        await service.create(session);

        expect(
            await service.delete({
                find: {
                    walletAddress: session.walletAddress,
                    createdAt: session.createdAt,
                },
            }),
        ).toBeTruthy();
    });
});
