import {
    Request,
    Controller,
    Get,
    Post,
    UseGuards,
    Body,
} from "@nestjs/common";
import { NestAuthService } from "./nestauth.service";
import { NestAuthGuard } from "./nestauth.guard";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("nestauth")
export class NestAuthController {
    constructor(private readonly nestAuthService: NestAuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req): Promise<any> {
        return this.nestAuthService.login(req.user);
    }

    @Get("refresh-token")
    refreshToken(@Body() params: { refresh_token: string }): Promise<any> {
        return this.nestAuthService.refreshToken(params.refresh_token);
    }

    @UseGuards(LocalAuthGuard)
    @Post("auth/logout")
    async logout(@Request() req) {
        return req.logout();
    }
}
