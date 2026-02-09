import {
    Module,
    DynamicModule,
    forwardRef,
    UseFilters,
    Controller,
    Inject,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestAuthService } from "./nestauth.service";
import { NestAuthController } from "./nestauth.controller";
import { NestAuthModuleOptions } from "./nestauth.interface";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { NestAuthJwtStrategy } from "./nestauth-jwt.strategy";
import { NestAuthLocalStrategy } from "./nestauth-local.strategy";
import { NestAuthGoogleStrategy } from "./nestauth-google.strategy";
import { NestAuthFacebookStrategy } from "./nestauth-facebook.strategy";
import { StringValue } from "ms";
import { HttpExceptionFilter } from "./http-exception.filter";

@Module({
    imports: [PassportModule, ConfigModule.forRoot({})],
})
export class NestAuthModule {
    static register(options: NestAuthModuleOptions): DynamicModule {
        // Create unique tokens for each module instance
        const moduleId = options.routePrefix || "default";
        const AUTH_SERVICE_TOKEN = Symbol(`NestAuthService_${moduleId}`);
        const USER_SERVICE_TOKEN = Symbol(`UserService_${moduleId}`);

        const controllerPath = options.routePrefix
            ? `${options.routePrefix.replace(/^\/|\/$/g, "")}/nestauth`
            : "nestauth";

        @UseFilters(HttpExceptionFilter)
        @Controller(controllerPath)
        class DynamicNestAuthController extends NestAuthController {
            constructor(
                @Inject(AUTH_SERVICE_TOKEN) nestAuthService: NestAuthService,
            ) {
                super(nestAuthService);
            }
        }

        return {
            module: NestAuthModule,
            imports: [
                JwtModule.registerAsync({
                    imports: [],
                    inject: [],
                    useFactory: async () => ({
                        secret: options.jwtSecret,
                        signOptions: {
                            expiresIn: options.jwtExpiresIn as
                                | StringValue
                                | number,
                        },
                    }),
                }),
                forwardRef(() => options.UserModule),
            ],
            providers: [
                // NestAuthService with unique token
                {
                    provide: AUTH_SERVICE_TOKEN,
                    useClass: NestAuthService,
                },
                // UserService with unique token
                {
                    provide: USER_SERVICE_TOKEN,
                    useExisting: options.UserService,
                },
                // Alias for backward compatibility
                {
                    provide: "UserService",
                    useFactory: (userService) => userService,
                    inject: [USER_SERVICE_TOKEN],
                },
                {
                    provide: "JWT_SECRET",
                    useValue: options.jwtSecret,
                },
                {
                    provide: "JWT_EXPIRES_IN",
                    useValue: options.jwtExpiresIn,
                },
                {
                    provide: "JWT_REFRESH_TOKEN_EXPIRES_IN",
                    useValue: options.jwtRefreshTokenExpiresIn,
                },
                NestAuthJwtStrategy,
                NestAuthLocalStrategy,
                NestAuthGoogleStrategy,
                NestAuthFacebookStrategy,
            ],
            exports: [AUTH_SERVICE_TOKEN, "UserService"],
            controllers: [DynamicNestAuthController],
        };
    }
}
