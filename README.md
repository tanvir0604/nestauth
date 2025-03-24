# NestJS Authentication with @next-nest-auth/nestauth

This README provides instructions to set up authentication in a NestJS application using the `@next-nest-auth/nestauth` package.

## Prerequisites

-   Node.js and npm installed on your machine
-   NestJS application set up

## Installation Instructions

### 1. Install NestJS Application

If you haven't already created a NestJS application, you can create one using the NestJS CLI:

```bash
npm i -g @nestjs/cli
nest new nestauth-app
cd nestauth-app
```

### 2. Install `@next-nest-auth/nestauth` Package

Next, install the `@next-nest-auth/nestauth` package:

```bash
npm install @next-nest-auth/nestauth
```

### 3. Load `NestAuthModule` in the App

Import and register `NestAuthModule` in your application's module.

Edit `app.module.ts` to add `NestAuthModule`:

```typescript
import { Module } from "@nestjs/common";
import { NestAuthModule } from "@next-nest-auth/nestauth";
import { UserService } from "./user.service";

@Module({
    imports: [
        NestAuthModule.register({
            UserModule: UserModule,
            UserService: UserService,
            jwtSecret: process.env.JWT_SECRET || "my-secret-key",
            jwtExpiresIn: "1m",
        }),
    ],
    providers: [UserService],
    exports: [UserService],
})
export class AppModule {}
```

### 4. Create the `UserService`

Create a `UserService` that implements `NestAuthInterface`. This service will handle user authentication and the process for validating user credentials, integrating third-party services like Google and Facebook.

Create a new file `user.service.ts` and add the following code:

```typescript
import { Injectable } from "@nestjs/common";
import { JwtPayloadType, NestAuthInterface } from "@next-nest-auth/nestauth";

@Injectable()
export class UserService implements NestAuthInterface {
    constructor() {}

    async validateUser(params: any): Promise<JwtPayloadType> {
        // Simulate user authentication, usually done by checking password against database
        return {
            sub: 1,
            name: "John Doe",
            email: "QlLZL@example.com",
            role: "user",
        };
    }

    async getUserById(id: number): Promise<JwtPayloadType> {
        return {
            sub: id,
            name: "John Doe",
            email: "QlLZL@example.com",
            role: "user",
        };
    }
}
```

### 5. Test the Installation

To test if the installation is successful, call POST -> `http://localhost:3000/nestauth/login` with your username/password or any params like mobile number/otp. It will generate and return access_token

#### example response

```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiUWxMWkxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsIm1hY0lkIjoiMDI6NDI6YTQ6NGM6MjU6YjgiLCJpYXQiOjE3Mzg1NTgyMDQsImV4cCI6MTczODU2MTgwNH0.8RtsLfhIMwWXloT65UgCHOaDyZaVkXxcS1ER6hpZ9H4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiUWxMWkxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsIm1hY0lkIjoiMDI6NDI6YTQ6NGM6MjU6YjgiLCJpYXQiOjE3Mzg1NTgyMDQsImV4cCI6MTczOTE2MzAwNH0.eP70K-0Dyh-hPO1GcKoMugmxxt8TCR4thh_NHZfgG50",
    "accessTokenExpiresIn": "1h",
    "refreshTokenExpiresIn": "7d"
}
```

### 6 Refresh tokens

To refresh your token call GET -> `http://localhost:3000/nestauth/refresh_token` with your params `refresh_token` with value `your-refresh-token`

#### On Success

```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiUWxMWkxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTczODU1OTQ0NCwiZXhwIjoxNzM4NTYzMDQ0fQ.l1aNl4s6f4KciTL7UGpKpTT_0RgQG51UJPi57GPcv9g",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiUWxMWkxAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTczODU1OTQ0NCwiZXhwIjoxNzM5MTY0MjQ0fQ.RQbGBBiwOR6VT7632VSGvN2j0SLdjLc_dTksyWswB3s",
    "accessTokenExpiresIn": "1h",
    "refreshTokenExpiresIn": "7d"
}
```

#### On failed

```
{
    "statusCode": 401,
    "message": "Invalid or expired refresh token",
    "path": "/nestauth/refresh-token",
    "app": "nestauth"
}
```

### 7. Protect Routes Using Guards

You can now protect routes using the `NestAuthJwtGuard`. For example, to protect a route that returns user profile information:

Edit the `app.controller.ts` or your desired controller:

```typescript
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { NestAuthJwtGuard } from "@next-nest-auth/nestauth";

@Controller("user")
export class AppController {
    @Get("/profile")
    @UseGuards(NestAuthJwtGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}
```

Now your NestJS app will be set up with authentication using `@next-nest-auth/nestauth`. You can protect routes with the `NestAuthJwtGuard` and handle user authentication, JWT management.

### 7. Environment Variables

Don't forget to add the `JWT_SECRET` environment variable in your `.env` file:

```bash
JWT_SECRET=my-secret-key
```

---

## Summary

This README has guided you through:

1. Installing the `@next-nest-auth/nestauth` package.
2. Registering the `NestAuthModule` in your `AppModule`.
3. Creating a custom `UserService` to handle user authentication.
4. Protecting routes with the `NestAuthJwtGuard`.
5. Testing the authentication setup.

You now have a basic NestJS app with JWT authentication ready to use. Feel free to extend this with additional authentication strategies like OAuth, refresh tokens, and more!
