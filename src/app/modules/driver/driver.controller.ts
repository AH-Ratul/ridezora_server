import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DriverService } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const getAvailableRides = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;

  const result = await DriverService.getAvailableRides(
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have ride request",
    data: result,
  });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const decodedToken = req.user;

  await DriverService.acceptRide(rideId, decodedToken as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Ride Accepted",
    data: null,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const { status } = req.body;
  const decodedToken = req.user;

  const result = await DriverService.updateRideStatus(
    rideId,
    status,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Ride ${result.status}`,
    data: null,
  });
});

const cancelARide = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const decodedToken = req.user;

  await DriverService.cancelARide(rideId, decodedToken as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ride Cancelled",
    data: null,
  });
});

const myRides = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;

  const result = await DriverService.myRides(decodedToken as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your Earning summary",
    data: result,
  });
});

export const DriverController = {
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  cancelARide,
  myRides,
};
