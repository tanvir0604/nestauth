import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { NestAuthInterface } from "./nestauth.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class NestAuthService {
    constructor(
        private jwtService: JwtService,
        @Inject("UserService") private readonly userService: NestAuthInterface,
        @Inject("JWT_EXPIRES_IN") private readonly jwtExpiresIn: string
    ) {}

    async login(user: any): Promise<any> {
        return {
            access_token: this.jwtService.sign(user, {
                expiresIn: this.jwtExpiresIn || "15m",
            }),
            refresh_token: this.jwtService.sign(user, { expiresIn: "7d" }),
        };
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
