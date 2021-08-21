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

    it('valid signature', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: now,
                signature,
            }),
        ).toBeTruthy();
    });

    it('manipulated timestamp', () => {
        expect(
            service.verifySignature({
                wallet: identity.address,
                timestamp: now - 1,
                signature,
            }),
        ).toBeFalsy();
    });

    it('manipulated wallet address', () => {
        expect(
            service.verifySignature({
                wallet: createIdentity().address,
                timestamp: now,
                signature,
            }),
        ).toBeFalsy();
    });

    it('manipulated signature', () => {
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
});