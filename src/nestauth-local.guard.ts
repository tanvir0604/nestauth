import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// @Injectable()
// export class NestAuthLocalGuard extends AuthGuard("nestauth-local") {}

export function createLocalGuard(strategyName: string) {
    @Injectable()
    class NestAuthLocalGuard extends AuthGuard(strategyName) {}

    return NestAuthLocalGuard;
}
