export interface JwtToken {
    payload: JwtTokenPayload;
    jwt: string;
}

export interface JwtTokenPayload {
    wallet: string;
    createdAt: Date;
}
