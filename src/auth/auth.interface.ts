export interface JwtPayload {
    wallet: string;
}

export interface AuthenticatedUser {
    wallet: string;
}

export interface LoginRequest {
    wallet: string;
    timestamp: number;
    signature: string;
}
