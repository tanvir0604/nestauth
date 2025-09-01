import { Type } from "@nestjs/common";

export interface NestAuthModuleOptions {
    UserModule: Type<any>;
    UserService: Type<NestAuthInterface>;
    jwtSecret: string;
    jwtExpiresIn?: string;
    jwtRefreshTokenExpiresIn?: string;
}

export type JwtPayloadType = {
    sub: number | string;
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    pic?: string;
    macId?: string;
    [key: string]: number | string | boolean | undefined;
} | null;

export type SocialProfileType = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
};

export type GoogleProfileType = SocialProfileType;
export type FacebookProfileType = SocialProfileType;

export interface NestAuthInterface {
    validateUser(params: any): Promise<JwtPayloadType>;
    getUserById(id: number | string): Promise<JwtPayloadType>;
    google?(params: GoogleProfileType): Promise<JwtPayloadType>;
    facebook?(params: FacebookProfileType): Promise<JwtPayloadType>;
}
