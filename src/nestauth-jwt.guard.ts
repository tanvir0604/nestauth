import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as macaddress from "macaddress";

@Injectable()
export class NestAuthJwtGuard extends AuthGuard("jwt") {
    // ✅ Custom error handling here
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        console.log("err, user, info, context1");
        if (err || !user) {
            throw new UnauthorizedException(
                "Unauthorized: Invalid or missing token"
            );
        }
        return user;
    }

    // ✅ Make sure to return the result of `super.canActivate`
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = (await super.canActivate(context)) as boolean;
        if (!can) return false; // short-circuit if base guard fails

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException("Unauthorized: Invalid token");
        }

        const currentMacId = await macaddress.one();
        if (user.macId !== currentMacId) {
            throw new UnauthorizedException("Unauthorized: Device mismatch");
        }

        return true;
    }
}
