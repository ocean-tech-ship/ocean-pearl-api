import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { AuthModule } from '../../../auth.module';
import { AuthService } from '../../../services/auth.service';

describe('AuthService', () => {
    let module: TestingModule;
    let service: AuthService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AuthModule, AppModule],
            providers: [ConfigService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
