import { Module, DynamicModule, Provider, forwardRef } from "@nestjs/common";
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
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./http-exception.filter";
import { ClientsModule } from "@nestjs/microservices";

@Module({
    imports: [PassportModule, ConfigModule.forRoot({})],
})
export class NestAuthModule {
    static register(options: NestAuthModuleOptions): DynamicModule {
        const UserServiceProvider: Provider = {
            provide: "UserService",
            useExisting: options.UserService,
        };

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

        return {
            module: NestAuthModule,
            imports: [
                JwtModule.registerAsync({
                    imports: [],
                    inject: [],
                    useFactory: async () => ({
                        secret: options.jwtSecret,
                        signOptions: {
                            expiresIn: options.jwtExpiresIn,
                        },
                    }),
                }),
                forwardRef(() => options.UserModule),
            ],
            providers: [
                NestAuthService,
                UserServiceProvider,
                NestAuthJwtStrategy,
                NestAuthLocalStrategy,
                NestAuthGoogleStrategy,
                NestAuthFacebookStrategy,
                JwtSecretProvider,
                JwtExpiresInProvider,
                JwtRefreshTokenExpiresInProvider,
                {
                    provide: APP_FILTER,
                    useClass: HttpExceptionFilter,
                },
            ],
            exports: [NestAuthService],
            controllers: [NestAuthController],
        };
    }
}
