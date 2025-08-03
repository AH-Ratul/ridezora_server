import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { env } from "./env";
import { Role } from "../modules/user/user.interface";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          done("User does not exist");
        }

        const isGoogleAuthenticated = isUserExist?.auths.some(
          (providerObj) => providerObj.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist?.password) {
          done(
            "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password."
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          password as string,
          isUserExist?.password as string
        );

        if (!isPasswordMatch) {
          done(null, false, { message: "Password does not Match" });
        }

        return done(null, isUserExist as unknown as string);
      } catch (error) {
        console.log("local", error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.RIDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("google stratagy error", error);
        return done(error);
      }
    }
  )
);
