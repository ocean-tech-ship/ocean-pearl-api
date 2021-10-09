import { Injectable } from '@nestjs/common';
import { LoginRequest } from '../models/login-request.model';
import { utils } from 'ethers';

@Injectable()
export class VerifyLoginService {
    public static readonly TIMESTAMP_TTL = 1000 * 60 * 15; // 15min

    /* Reconstructs plaintext message for the login request */
    public constructPlainSignature(timestamp: Date): string {
        return `oceanpearl.io - login @ ${timestamp.toISOString()}`;
    }

    /** Verifies the ethereum based signature from a login request */
    public verifySignature(request: LoginRequest): boolean {
        const plainSignature = this.constructPlainSignature(
            new Date(request.timestamp),
        );

        const recoveredAddress = utils.recoverAddress(
            utils.hashMessage(plainSignature),
            request.signature,
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
