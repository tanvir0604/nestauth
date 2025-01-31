import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import { FacebookProfileType } from "./nestauth.interface";

@Injectable()
export class NestAuthFacebookStrategy extends PassportStrategy(
    Strategy,
    "facebook"
) {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.BASE_URL + "/nestauth/facebook-redirect",
            scope: ["email", "public_profile"],
            profileFields: ["id", "displayName", "photos", "email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user: FacebookProfileType = {
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
