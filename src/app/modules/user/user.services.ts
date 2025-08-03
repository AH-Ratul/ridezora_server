import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email Already Exists");
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(env.SALT)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: authProvider,
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {};

export const UserService = {
  createUser,
  getAllUsers,
};
