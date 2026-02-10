import { Module, DynamicModule, Provider, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestAuthService } from "./nestauth.service";
import { createDynamicController } from "./nestauth.controller";
import { NestAuthInterface, NestAuthModuleOptions } from "./nestauth.interface";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { NestAuthJwtStrategy } from "./nestauth-jwt.strategy";
// import { NestAuthLocalStrategy } from "./nestauth-local.strategy";
import { NestAuthGoogleStrategy } from "./nestauth-google.strategy";
import { NestAuthFacebookStrategy } from "./nestauth-facebook.strategy";
import { StringValue } from "ms";
import { createLocalStrategy } from "./nestauth-local.strategy";
import { createLocalGuard } from "./nestauth-local.guard";

@Module({
    imports: [PassportModule, ConfigModule.forRoot({})],
})
export class NestAuthModule {
    static forRoot(options: NestAuthModuleOptions): DynamicModule {
        const JwtSecretProvider: Provider = {
            provide: "JWT_SECRET",
            useValue: options.jwtSecret || "60s",
        };

        const JwtExpiresInProvider: Provider = {
            provide: "JWT_EXPIRES_IN",
            useValue: options.jwtExpiresIn,
        };

        const JwtRefreshTokenExpiresInProvider: Provider = {
            provide: "JWT_REFRESH_TOKEN_EXPIRES_IN",
            useValue: options.jwtRefreshTokenExpiresIn,
        };

        const controllerPath = options.routePrefix
            ? `${options.routePrefix.replace(/^\/|\/$/g, "")}/nestauth`
            : "nestauth";

        const pathKey = controllerPath.replaceAll("/", "_").toUpperCase();

        const userServiceToken = `NEST_AUTH_USER_SERVICE_${pathKey}`;
        const nestAuthServiceToken = `NEST_AUTH_SERVICE_${pathKey}`;

        const strategyName = `${pathKey}-local`;

        const LocalStrategy = createLocalStrategy(
            strategyName,
            userServiceToken,
        );

        const LocalGuard = createLocalGuard(strategyName);

        console.log("controllerPath", controllerPath);
        console.log("pathKey", pathKey);
        console.log("userServiceToken", userServiceToken);
        console.log("nestAuthServiceToken", nestAuthServiceToken);

        console.log("------------------------------------------");

        const controller = createDynamicController(
            controllerPath,
            nestAuthServiceToken,
            LocalGuard,
        );

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
                {
                    provide: userServiceToken,
                    useExisting: options.UserService,
                },
                {
                    provide: nestAuthServiceToken,
                    useFactory: (
                        jwtService: JwtService,
                        userService: NestAuthInterface,
                        jwtExpiresIn: StringValue | number,
                        jwtRefreshTokenExpiresIn: StringValue | number,
                    ) =>
                        new NestAuthService(
                            jwtService,
                            userService,
                            jwtExpiresIn,
                            jwtRefreshTokenExpiresIn,
                        ),
                    inject: [
                        JwtService,
                        userServiceToken,
                        "JWT_EXPIRES_IN",
                        "JWT_REFRESH_TOKEN_EXPIRES_IN",
                    ],
                },
                NestAuthJwtStrategy,
                NestAuthGoogleStrategy,
                NestAuthFacebookStrategy,
                JwtSecretProvider,
                JwtExpiresInProvider,
                JwtRefreshTokenExpiresInProvider,
                LocalStrategy,
                LocalGuard,

                // {
                //     provide: APP_FILTER,
                //     useClass: HttpExceptionFilter,
                // },
            ],
            exports: [nestAuthServiceToken],
            controllers: [controller],
        };
    }
}
