import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { env } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        env.JWT_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(403, "User does not exist");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE ||
        isUserExist.isActive === IsActive.SUSPENDED
      ) {
        throw new AppError(403, `User is ${isUserExist.isActive}`);
      }

      if (isUserExist.isDeleted === true) {
        throw new AppError(403, "User is Deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to access the route");
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
