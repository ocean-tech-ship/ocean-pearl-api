import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../services/auth.service';
import { SessionRepository } from '../../../database/repositories/session.repository';
import { Session } from '../../../database/schemas/session.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../auth.module';
import { DatabaseModule } from '../../../database/database.module';
import { AppModule } from '../../../app.module';
import { createIdentity } from 'eth-crypto';
import { JwtToken, RefreshJwtPayload } from '../../interfaces/auth.interface';
import { hash } from 'bcrypt';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

describe('AuthRefreshController', () => {
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

    describe('when refresh with valid data', () => {
        it('should renew refresh & access token', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/refresh')
                .set(
                    'Cookie',
                    `${AuthService.SESSION_NAME_REFRESH}=${token.jwt}`,
                );

            expect(response.status).toBe(HttpStatus.OK);

            const cookies = response
                .get('Set-Cookie')
                .map((el) => el.split('=')[0]);

            expect(
                cookies.includes(AuthService.SESSION_NAME_ACCESS) &&
                    cookies.includes(AuthService.SESSION_NAME_REFRESH),
            ).toBeTruthy();

            const updatedSession = await repository.findOne({
                find: {
                    walletAddress: session.walletAddress,
                    createdAt: session.createdAt,
                },
            });

            expect(updatedSession.updatedAt.getTime()).toBeGreaterThan(
                session.updatedAt.getTime(),
            );
        });
    });

    describe('when refresh with invalid data', () => {
        it('should throw unauthorized without cookie', () => {
            request(app.getHttpServer())
                .post('/auth/refresh')
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should throw unauthorized for manipulation', () => {
            request(app.getHttpServer())
                .post('/auth/refresh')
                .set(
                    'Cookie',
                    `${AuthService.SESSION_NAME_REFRESH}=manipulation`,
                )
                .expect(HttpStatus.UNAUTHORIZED);
        });

        it('should throw unauthorized for disabled session', async () => {
            await repository.deleteByWalletAddress(session.walletAddress);

            request(app.getHttpServer())
                .post('/auth/refresh')
                .set(
                    'Cookie',
                    `${AuthService.SESSION_NAME_REFRESH}=${token.jwt}`,
                )
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});
