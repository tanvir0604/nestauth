import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
    FacebookProfileType,
    GoogleProfileType,
    JwtPayloadType,
    NestAuthInterface,
} from "./nestauth.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class NestAuthService {
    constructor(
        private jwtService: JwtService,
        @Inject("UserService") private readonly userService: NestAuthInterface,
        @Inject("JWT_EXPIRES_IN") private readonly jwtExpiresIn: string,
        @Inject("JWT_REFRESH_TOKEN_EXPIRES_IN")
        private readonly jwtRefreshTokenExpiresIn: string
    ) {}

    async login(user: any): Promise<any> {
        return {
            accessToken: this.jwtService.sign(user, {
                expiresIn: this.jwtExpiresIn || "15m",
            }),
            refreshToken: this.jwtService.sign(user, { expiresIn: "7d" }),
            accessTokenExpiresIn: this.jwtExpiresIn || "15m",
            refreshTokenExpiresIn: this.jwtRefreshTokenExpiresIn || "7d",
        };
    }

    async google(user: GoogleProfileType): Promise<any> {
        const payload: JwtPayloadType = await this.userService.google(user);

        if (!payload) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.login(payload);
    }

    async facebook(user: FacebookProfileType): Promise<any> {
        const payload: JwtPayloadType = await this.userService.facebook(user);

        if (!payload) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.login(payload);
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.validateUser(payload.id);
            if (!user) {
                throw new UnauthorizedException(
                    "Invalid or expired refresh token"
                );
            }
            return this.login(user);
        } catch (err) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }
}
