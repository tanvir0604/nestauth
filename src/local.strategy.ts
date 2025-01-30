import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { NestAuthInterface } from "./nestauth.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject("UserService") private readonly userService: NestAuthInterface
    ) {
        super();
    }

    async validate(
        username: string,
        password: string,
        mobile: string
    ): Promise<any> {
        const user = await this.userService.validateUser({
            username,
            password,
            mobile,
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
