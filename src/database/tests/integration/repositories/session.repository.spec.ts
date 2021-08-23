import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../../database.module';
import { AppModule } from '../../../../app.module';
import { SessionRepository } from '../../../repositories/session.repository';
import { createIdentity } from 'eth-crypto';
import { Session } from '../../../schemas/session.schema';

describe('SessionRepository', () => {
    let service: SessionRepository;

    let identity: {
        privateKey: string;
        publicKey: string;
        address: string;
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<SessionRepository>(SessionRepository);

        identity = createIdentity();
    });

    afterAll(async () => {
        await service.deleteByWalletAddress(identity.address);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be created', async () => {
        const session: Session | any = {
            walletAddress: identity.address,
            hashedToken: 'HASHED_TOKEN',
        };

        await service.create(session);

        expect(
            (await service.getByWalletAddress(identity.address)).length,
        ).toBeGreaterThan(1);

        expect(
            (
                await service.getByWalletAddressAndHashedToken(
                    session.walletAddress,
                    session.hashedToken,
                )
            ).hashedToken,
        ).toBe(session.hash);
    });

    it('should be deleted', async () => {
        const session: Session | any = {
            walletAddress: identity.address,
            hashedToken: 'HASHED_TOKEN_2',
        };

        await service.create(session);

        expect(
            await service.deleteSession(
                session.walletAddress,
                session.hashedToken,
            ),
        ).toBeTruthy();
    });
});
