import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { GoogleProfileType } from "./nestauth.interface";

@Injectable()
export class NestAuthGoogleStrategy extends PassportStrategy(
    Strategy,
    "google"
) {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || "your-client-id",
            clientSecret:
                process.env.GOOGLE_CLIENT_SECRET || "your-client-secret",
            callbackURL: process.env.BASE_URL + "/nestauth/google-redirect",
            scope: ["email", "profile"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user: GoogleProfileType = {
            id: profile.id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken,
        };
        done(null, user);
    }
}
