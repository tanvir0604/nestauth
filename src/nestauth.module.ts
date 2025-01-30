import { Module, DynamicModule, Provider } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestAuthService } from "./nestauth.service";
import { NestAuthController } from "./nestauth.controller";
import { NestAuthModuleOptions } from "./nestauth.interface";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./http-exception.filter";

@Module({
    imports: [PassportModule, ConfigModule],
})
export class NestAuthModule {
    static register(options: NestAuthModuleOptions): DynamicModule {
        const UserServiceProvider: Provider = {
            provide: "UserService",
            useClass: options.UserService,
        };

        const JwtSecretProvider: Provider = {
            provide: "JWT_SECRET",
            useValue: options.jwtSecret || "60s",
        };

        const JwtExpiresInProvider: Provider = {
            provide: "JWT_EXPIRES_IN",
            useValue: options.jwtExpiresIn,
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
            ],
            providers: [
                NestAuthService,
                UserServiceProvider,
                JwtStrategy,
                LocalStrategy,
                JwtSecretProvider,
                JwtExpiresInProvider,
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
