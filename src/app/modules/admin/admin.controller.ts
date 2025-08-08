import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from "http-status-codes";

//----------------------- GET ALL USERS -----------------------
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All User Retrieved",
    data: result,
  });
});

//------------------ GET ALL DRIVERS ------------------
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllDrivers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Driver Retrieved",
    data: result,
  });
});

//-------------------- GET ALL RIDES --------------------
const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllRides();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Rides Retrievied Successfully",
    data: result,
  });
});

//----------------------- APPROVE DRIVER -----------------------
const approveADriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;

  const result = await AdminService.approveADriver(driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver Approved",
    data: result,
  });
});

//--------------------------- SUSPEND DRIVER -------------------------
const suspendADriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;

  const result = await AdminService.suspendADriver(driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver Suspended",
    data: result,
  });
});

//------------------------- BLOCK USER -----------------------
const blockAUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const result = await AdminService.blockAUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Blocked",
    data: result,
  });
});

//------------------------ UNBLOCK USER -----------------------
const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const result = await AdminService.unblockUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Unblocked",
    data: result,
  });
});

export const AdminController = {
  getAllDrivers,
  getAllUsers,
  getAllRides,
  approveADriver,
  suspendADriver,
  blockAUser,
  unblockUser,
};
