import { Type } from "@nestjs/common";

export interface NestAuthModuleOptions {
    UserService: Type<NestAuthInterface>;
    jwtSecret: string;
    jwtExpiresIn?: string;
}

export type JwtPayload = {
    sub: number;
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    pic?: string;
};

export interface NestAuthInterface {
    validateUser(params: any): Promise<JwtPayload>;
    getUserById(id: number): Promise<JwtPayload>;
}
