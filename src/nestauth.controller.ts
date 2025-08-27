import {
    Request,
    Controller,
    Get,
    Post,
    UseGuards,
    Body,
    UnauthorizedException,
    HttpStatus,
    All,
    UseFilters,
    BadRequestException,
} from "@nestjs/common";
import { NestAuthService } from "./nestauth.service";
import { NestAuthLocalGuard } from "./nestauth-local.guard";
import { NestAuthGoogleGuard } from "./nestauth-google.guard";
import { NestAuthFacebookGuard } from "./nestauth-facebook.guard";
import { HttpExceptionFilter } from "./http-exception.filter";

@UseFilters(HttpExceptionFilter)
@Controller("nestauth")
export class NestAuthController {
    constructor(private readonly nestAuthService: NestAuthService) {}

    @All()
    async greetings(): Promise<string> {
        return "Welcome to NestAuth. Please check our documentation for more information.";
    }

    @UseGuards(NestAuthLocalGuard)
    @Post("login")
    async login(@Request() req): Promise<any> {
        return this.nestAuthService.login(req.user);
    }

    @Post("refresh-token")
    refreshToken(@Body() params: { refresh_token: string }): Promise<any> {
        if (!params.refresh_token) {
            throw new BadRequestException("Invalid or expired refresh token");
        }
        return this.nestAuthService.refreshToken(params.refresh_token);
    }

    @UseGuards(NestAuthGoogleGuard)
    @Get("google")
    async googleAuth(@Request() req): Promise<any> {}

    @Get("google-redirect")
    @UseGuards(NestAuthGoogleGuard)
    googleAuthRedirect(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException("Unable to login with Google");
        }
        return this.nestAuthService.google(req.user);
    }

    @Get("/facebook")
    @UseGuards(NestAuthFacebookGuard)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook-redirect")
    @UseGuards(NestAuthFacebookGuard)
    async facebookLoginRedirect(@Request() req): Promise<any> {
        if (!req.user) {
            throw new UnauthorizedException("Unable to login with Facebook");
        }
        return this.nestAuthService.facebook(req.user);
    }

    @UseGuards(NestAuthLocalGuard)
    @Get("logout")
    async logout(@Request() req) {
        return req.logout();
    }
}
