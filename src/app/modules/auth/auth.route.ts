import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "passport";
import { User } from "../user/user.model";

export const authRoute = Router();

authRoute.post("/login", AuthController.credentialsLogin);

authRoute.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  AuthController.goolgeCallbackController
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
