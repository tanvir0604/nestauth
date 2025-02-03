import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class NestAuthJwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject("JWT_SECRET") jwtSecret: string) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
            macId: payload.macId,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            username: payload.username,
            pic: payload.pic,
        };
    }
}
