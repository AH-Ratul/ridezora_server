import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { createUserToken } from "../../utils/userTokens";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookies";
import { env } from "../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, err);
      }

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, info.message);
      }

      const userTokens = createUserToken(user);

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login Successfull",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const goolgeCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const tokenInfo = createUserToken(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${env.CLIENT_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialsLogin,
  goolgeCallbackController
};
