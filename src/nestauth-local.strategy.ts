import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { NestAuthInterface } from "./nestauth.interface";

@Injectable()
export class NestAuthLocalStrategy extends PassportStrategy(
    Strategy,
    "nestauth-local"
) {
    constructor(
        @Inject("UserService") private readonly userService: NestAuthInterface
    ) {
        super();
    }

    async validate(req: Request): Promise<any> {
        // const { email, phone, username, password, otp } = req.body;

        const user = await this.userService.validateUser(req.body);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return user;
    }
}
