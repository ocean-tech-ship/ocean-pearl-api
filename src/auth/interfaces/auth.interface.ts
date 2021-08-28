export interface AccessJwtPayload {
    wallet: string;
}

export interface RefreshJwtPayload {
    wallet: string;
    createdAt: Date;
}

export interface JwtToken<Payload> {
    payload: Payload;
    jwt: string;
}

/* this is our user which will be available on all protected endpoints (access-token) */
export interface AuthenticatedUser {
    wallet: string;
}
