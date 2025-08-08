import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Retrieved",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const body = req.body;
  const decodedToken = req.user;
  const result = await UserService.updateUser(
    userId,
    body,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Updated",
    data: result,
  });
});

export const UserController = {
  createUser,
  getSingleUser,
  updateUser,
};
