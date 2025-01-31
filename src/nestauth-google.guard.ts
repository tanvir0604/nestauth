import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class NestAuthGoogleGuard extends AuthGuard("google") {
    constructor(private configService: ConfigService) {
        super({
            accessType: "offline",
        });
    }
}
