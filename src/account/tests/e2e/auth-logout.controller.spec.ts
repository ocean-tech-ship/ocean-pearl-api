import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../../auth/services/auth.service';
import { SessionRepository } from '../../../database/repositories/session.repository';
import {
    JwtToken,
    RefreshJwtPayload,
} from '../../../auth/interfaces/auth.interface';
import { Session } from '../../../database/schemas/session.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../../auth/auth.module';
import { DatabaseModule } from '../../../database/database.module';
import { AppModule } from '../../../app.module';
import * as cookieParser from 'cookie-parser';
import { createIdentity } from 'eth-crypto';
import { hash } from 'bcrypt';
import * as request from 'supertest';

describe('AuthLogoutController', () => {
    let app: INestApplication;

    let controller: AuthController;
    let service: AuthService;
    let repository: SessionRepository;

    let token: JwtToken<RefreshJwtPayload>;
    let session: Session;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, AuthModule, DatabaseModule, AppModule],
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        app = module.createNestApplication();
        app.use(cookieParser());
        await app.init();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
        repository = module.get<SessionRepository>(SessionRepository);

        token = service.createRefreshToken({
            wallet: createIdentity().address,
        });

        await repository.create(
            (session = <Session>{
                walletAddress: token.payload.wallet,
                createdAt: token.payload.createdAt,
                updatedAt: token.payload.createdAt,
                hashedToken: await hash(token.jwt, 10),
            }),
        );
    });

    afterEach(async () => {
        await repository.deleteByWalletAddress(session.walletAddress);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('when logout with valid session', () => {
        it('should invalidate refresh token and clear cookies', async () => {
            const response = await request(app.getHttpServer())
                .post('/account/logout')
                .set(
                    'Cookie',
                    `${AuthService.SESSION_NAME_REFRESH}=${token.jwt}`,
                );

            expect(response.status).toBe(HttpStatus.OK);

            for (const cookie of response.get('Set-Cookie')) {
                expect(
                    cookie.startsWith(`${AuthService.SESSION_NAME_ACCESS}=;`) ||
                        cookie.startsWith(
                            `${AuthService.SESSION_NAME_REFRESH}=;`,
                        ),
                ).toBeTruthy();
            }

            expect(
                (
                    await repository.getAll({
                        find: { walletAddress: session.walletAddress },
                    })
                ).length,
            ).toBe(0);
        });
    });

    describe('when logout at any other state', async () => {
        it('should be ok', () => {
            request(app.getHttpServer())
                .post('/account/logout')
                .expect(HttpStatus.OK);
        });
    });
});
