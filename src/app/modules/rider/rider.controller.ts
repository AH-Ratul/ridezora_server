import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { RiderService } from "./rider.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const requestARide = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await RiderService.requestARide(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ride is requested",
    data: result,
  });
});

const cancelARide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const decodedToken = req.user;

  const result = await RiderService.cancelARide(
    rideId,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ride is Cancelled",
    data: result,
  });
});

const myRides = catchAsync(async (req: Request, res: Response) => {});

export const RiderController = {
  requestARide,
  cancelARide,
  myRides,
};
