import { Injectable } from '@nestjs/common';
import { recover, hash } from 'eth-crypto';
import { LoginRequest } from '../auth.interface';

@Injectable()
export class VerifyLoginService {
    public static readonly TIMESTAMP_TTL = 1000 * 60 * 15; // 15min

    /* Reconstructs plaintext message for the login request */
    public constructPlainSignature(timestamp: number): string {
        const payload = `oceanpearl.io - login @ ${timestamp}`;
        return `\x19Ethereum Signed Message:\n${payload.length}${payload}`;
    }

    /** Verifies the ethereum based signature from a login request */
    public verifySignature(request: LoginRequest): boolean {
        const plainSignature = this.constructPlainSignature(request.timestamp);

        const recoveredAddress = recover(
            request.signature,
            hash.keccak256(plainSignature),
        );

        return recoveredAddress === request.wallet;
    }

    /** Verifies that the login request is only valid for a specific time range */
    public verifyTimestamp(request: LoginRequest): boolean {
        const now = Date.now();
        return (
            now >= request.timestamp &&
            now <= request.timestamp + VerifyLoginService.TIMESTAMP_TTL
        );
    }
}
