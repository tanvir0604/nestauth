import { Module, DynamicModule, Provider, UseFilters } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestAuthService } from "./nestauth.service";
import { NestAuthController } from "./nestauth.controller";
import { NestAuthModuleOptions } from "./nestauth.interface";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

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
            ],
            exports: [NestAuthService],
            controllers: [NestAuthController],
        };
    }
}
