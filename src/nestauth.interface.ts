import { Type } from "@nestjs/common";

export interface NestAuthModuleOptions {
    UserService: Type<NestAuthInterface>;
    jwtSecret: string;
    jwtExpiresIn?: string;
}

export type JwtPayloadType = {
    sub: number;
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    pic?: string;
};

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
    getUserById(id: number): Promise<JwtPayloadType>;
    google(params: GoogleProfileType): Promise<JwtPayloadType>;
    facebook(params: FacebookProfileType): Promise<JwtPayloadType>;
}
