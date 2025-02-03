import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as macaddress from "macaddress";

@Injectable()
export class NestAuthJwtGuard extends AuthGuard("jwt") {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        await super.canActivate(context);
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
