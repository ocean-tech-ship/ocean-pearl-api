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
