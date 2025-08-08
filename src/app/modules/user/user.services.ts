import AppError from "../../errorHelpers/AppError";
import {
  IAuthProvider,
  IsAvailable,
  IUser,
  Role,
} from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

//-------------------- CREATE USER ------------------
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

  if (rest.role === Role.DRIVER) {
    rest.isApproved = false;
    rest.availability = IsAvailable.ONLINE;
  }

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: authProvider,
    ...rest,
  });

  return user;
};

//----------------- GET SINGLE USER -----------------
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId);

  return { data: user };
};

//------------------ UPDATE USER ----------------------
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    // block normer user from changing any roles
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    //prevent ADMIN from assigning the SUPER_ADMIN role
    // only SUPER_ADMIN can assign the SUPER_ADMIN role
    if (
      decodedToken.role === Role.SUPER_ADMIN &&
      decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only SUPER_ADMIN can assign SUPER_ADMIN role"
      );
    }
  }

  if (
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified ||
    payload.isApproved
  ) {
    // block RIDER & DRIVER from change user status
    if (
      decodedToken.role === Role.DRIVER ||
      decodedToken.role === Role.DRIVER
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, env.SALT);
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

export const UserService = {
  createUser,
  getSingleUser,
  updateUser,
};
