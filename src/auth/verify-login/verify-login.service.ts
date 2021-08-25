import { Injectable } from '@nestjs/common';
import { recover, hash } from 'eth-crypto';
import { LoginRequest } from '../auth.interface';

@Injectable()
export class VerifyLoginService {
    public static readonly TIMESTAMP_TTL = 1000 * 60 * 15; // 15min

    /* Reconstructs plaintext message for the login request */
    public constructPlainSignature(timestamp: Date): string {
        const payload = `oceanpearl.io - login @ ${timestamp.toISOString()}`;
        return `\x19Ethereum Signed Message:\n${payload.length}${payload}`;
    }

    /** Verifies the ethereum based signature from a login request */
    public verifySignature(request: LoginRequest): boolean {
        const plainSignature = this.constructPlainSignature(
            new Date(request.timestamp),
        );

        const recoveredAddress = recover(
            request.signature,
            hash.keccak256(plainSignature),
        );

        return recoveredAddress === request.wallet;
    }

    /** Verifies that the login request is only valid for a specific time range */
    public verifyTimestamp(request: LoginRequest): boolean {
        const timestamp = new Date(request.timestamp).getTime();
        const now = Date.now();

        return (
            now >= timestamp &&
            now <= timestamp + VerifyLoginService.TIMESTAMP_TTL
        );
    }
}
