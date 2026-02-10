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
    BadRequestException,
    UseFilters,
    Inject,
} from "@nestjs/common";
import { NestAuthService } from "./nestauth.service";
import { NestAuthGoogleGuard } from "./nestauth-google.guard";
import { NestAuthFacebookGuard } from "./nestauth-facebook.guard";
import { HttpExceptionFilter } from "./http-exception.filter";

export function createDynamicController(
    prefix: string,
    nestAuthServiceToken: string,
    localGuard: any,
) {
    @UseFilters(HttpExceptionFilter)
    @Controller(prefix)
    class NestAuthController {
        constructor(
            @Inject(nestAuthServiceToken)
            readonly nestAuthService: NestAuthService,
        ) {}

        @All()
        async greetings(): Promise<string> {
            return "Welcome to NestAuth. Please check our documentation for more information.";
        }

        @UseGuards(localGuard)
        @Post("login")
        async login(@Request() req: any): Promise<any> {
            console.log("nestAuthServiceToken", nestAuthServiceToken);
            return this.nestAuthService.login(req.user);
        }

        @Post("refresh-token")
        refreshToken(@Body() params: { refresh_token: string }): Promise<any> {
            if (!params.refresh_token) {
                throw new BadRequestException(
                    "Invalid or expired refresh token",
                );
            }
            return this.nestAuthService.refreshToken(params.refresh_token);
        }

        @UseGuards(NestAuthGoogleGuard)
        @Get("google")
        async googleAuth(@Request() req: any): Promise<any> {}

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
                throw new UnauthorizedException(
                    "Unable to login with Facebook",
                );
            }
            return this.nestAuthService.facebook(req.user);
        }

        @UseGuards(localGuard)
        @Get("logout")
        async logout(@Request() req: any) {
            return req.logout();
        }
    }

    return NestAuthController;
}
