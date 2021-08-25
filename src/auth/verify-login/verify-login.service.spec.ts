import { Test, TestingModule } from '@nestjs/testing';
import { VerifyLoginService } from './verify-login.service';
import { createIdentity, hash, sign } from 'eth-crypto';

describe('VerifyLoginService', () => {
    let service: VerifyLoginService;

    let identity: {
        privateKey: string;
        publicKey: string;
        address: string;
    };

    let now: number;
    let plainSignature: string;
    let signature: string;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VerifyLoginService],
        }).compile();

        service = module.get<VerifyLoginService>(VerifyLoginService);

        identity = createIdentity();

        now = Date.now();
        plainSignature = service.constructPlainSignature(now);
        signature = sign(identity.privateKey, hash.keccak256(plainSignature));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('signature should be valid', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: now,
                signature,
            }),
        ).toBeTruthy();
    });

    it('timestamp should be manipulated', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: now - 1,
                signature,
            }),
        ).toBeFalsy();
    });

    it('wallet address should be manipulated', () => {
        expect(
            service.verifySignature({
                wallet: createIdentity().address,
                timestamp: now,
                signature,
            }),
        ).toBeFalsy();
    });

    it('signature should be manipulated', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: now,
                signature: sign(
                    identity.privateKey,
                    hash.keccak256('manipulated'),
                ),
            }),
        ).toBeFalsy();
    });

    it('timestamp should be outdated', () => {
        const timestamp = Date.now() - VerifyLoginService.TIMESTAMP_TTL - 1;
        const plainSignature = service.constructPlainSignature(timestamp);

        const signature = sign(
            identity.privateKey,
            hash.keccak256(plainSignature),
        );

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
                timestamp: now,
                signature: signature,
            }),
        ).toBeTruthy();
    });
});
