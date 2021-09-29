import { Test, TestingModule } from '@nestjs/testing';
import { VerifyLoginService } from '../../../services/verify-login.service';
import { Wallet } from 'ethers';

describe('VerifyLoginService', () => {
    let service: VerifyLoginService;

    let identity: Wallet;

    let now: number;
    let plainSignature: string;
    let signature: string;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VerifyLoginService],
        }).compile();

        service = module.get<VerifyLoginService>(VerifyLoginService);

        identity = Wallet.createRandom();

        now = Date.now();
        plainSignature = service.constructPlainSignature(new Date(now));

        signature = await identity.signMessage(plainSignature);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('signature should be valid', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: new Date(now),
                signature,
            }),
        ).toBeTruthy();
    });

    it('timestamp should be manipulated', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: new Date(now - 1),
                signature,
            }),
        ).toBeFalsy();
    });

    it('wallet address should be manipulated', () => {
        expect(
            service.verifySignature({
                wallet: Wallet.createRandom().address,
                timestamp: new Date(now),
                signature,
            }),
        ).toBeFalsy();
    });

    it('signature should be manipulated', async () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: new Date(now),
                signature: await identity.signMessage('manipulated'),
            }),
        ).toBeFalsy();
    });

    it('timestamp should be outdated', async () => {
        const timestamp = new Date(now - VerifyLoginService.TIMESTAMP_TTL - 1);
        const plainSignature = service.constructPlainSignature(timestamp);

        const signature = await identity.signMessage(plainSignature);

        expect(
            service.verifyTimestamp({
                wallet: identity.address,
                timestamp,
                signature,
            }),
        ).toBeFalsy();
    });

    it('timestamp should be valid', () => {
        expect(
            service.verifyTimestamp({
                wallet: identity.address,
                timestamp: new Date(now),
                signature: signature,
            }),
        ).toBeTruthy();
    });
});
