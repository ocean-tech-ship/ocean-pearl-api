import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../controllers/auth.controller';
import { VerifyLoginService } from '../../../auth/services/verify-login.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthModule } from '../../../auth/auth.module';
import { DatabaseModule } from '../../../database/database.module';
import { AppModule } from '../../../app.module';
import { SessionRepository } from '../../../database/repositories/session.repository';
import { LoginRequest } from '../../../auth/models/login-request.model';
import { Wallet } from 'ethers';

describe('AuthLoginController', () => {
    let app: INestApplication;

    let controller: AuthController;
    let service: VerifyLoginService;
    let repository: SessionRepository;

    let identity: Wallet;

    let now: number;
    let plainSignature: string;
    let loginRequest: LoginRequest;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, DatabaseModule, AppModule],
            controllers: [AuthController],
            providers: [VerifyLoginService],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        controller = module.get<AuthController>(AuthController);
        service = module.get<VerifyLoginService>(VerifyLoginService);
        repository = module.get<SessionRepository>(SessionRepository);

        identity = Wallet.createRandom();

        now = Date.now();
        plainSignature = service.constructPlainSignature(new Date(now));

        loginRequest = {
            wallet: identity.address,
            timestamp: new Date(now),
            signature: await identity.signMessage(plainSignature),
        };
    });

    afterAll(async () => {
        await repository.deleteMany({
            find: { walletAddress: identity.address },
        });
        await app.close();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('when login with valid data', () => {
        it('should generate session with jwt cookies', async () => {
            const response = await request(app.getHttpServer())
                .post('/account/login')
                .send(loginRequest);

            expect(response.status).toBe(HttpStatus.CREATED);

            const cookies = response
                .get('Set-Cookie')
                .map((el) => el.split('=')[0]);

            expect(
                cookies.includes(AuthService.SESSION_NAME) &&
                    cookies.includes(AuthService.SESSION_SHADOW_NAME),
            ).toBeTruthy();

            expect(
                (
                    await repository.getAll({
                        find: { walletAddress: identity.address },
                    })
                ).length,
            ).toBeGreaterThanOrEqual(1);
        });
    });

    describe('when login with invalid data', () => {
        it('should throw unauthorized for signature', async () => {
            request(app.getHttpServer())
                .post('/account/login')
                .send(<LoginRequest>{
                    wallet: identity.address,
                    timestamp: loginRequest.timestamp,
                    signature: 'other-sign',
                })
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should throw unauthorized for wallet', async () => {
            request(app.getHttpServer())
                .post('/account/login')
                .send(<LoginRequest>{
                    wallet: Wallet.createRandom().address,
                    timestamp: loginRequest.timestamp,
                    signature: loginRequest.signature,
                })
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should throw unauthorized for timestamp', async () => {
            request(app.getHttpServer())
                .post('/account/login')
                .send(<LoginRequest>{
                    wallet: loginRequest.wallet,
                    timestamp: new Date(),
                    signature: loginRequest.signature,
                })
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should throw unauthorized for outdated timestamp', async () => {
            const timestamp = new Date(
                Date.now() - VerifyLoginService.TIMESTAMP_TTL - 1,
            );

            request(app.getHttpServer())
                .post('/account/login')
                .send(<LoginRequest>{
                    wallet: identity.address,
                    timestamp: timestamp,
                    signature: await identity.signMessage(
                        service.constructPlainSignature(timestamp),
                    ),
                })
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});
