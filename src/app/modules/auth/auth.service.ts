import { JwtPayload } from "jsonwebtoken";
import { createAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { env } from "../../config/env";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  newPassword: string,
  oldPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(400, "Old Password does not match");
  }

  user!.password = await bcrypt.hash(newPassword as string, Number(env.SALT));

  user!.save();
};

export const AuthService = {
  getNewAccessToken,
  resetPassword
};
