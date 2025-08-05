import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IRide, Status } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

//------------------- REQUEST A RIDE ----------------
const requestARide = async (payload: IRide) => {
  const isUserExist = await User.findById(payload.rider);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not Found");
  }

  const existingRide = await Ride.findOne({
    rider: payload.rider,
    status: Status.REQUESTED,
  });

  if (existingRide) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have a ride request pending"
    );
  }

  const isDriverExist = await User.findOne({
    _id: payload.driver,
    isApproved: true,
    isActive: IsActive.ACTIVE,
  });

  if (!isDriverExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is not Available");
  }

  const ride = await Ride.create(payload);

  return ride;
};

//---------------- CANCEL RIDE ---------------
const cancelARide = async (rideId: string, decodedToken: JwtPayload) => {
  const existingRide = await Ride.findOne({
    _id: rideId,
    status: Status.REQUESTED,
  });

  if (!existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can not Cancel the Ride.");
  }

  const cancelRide = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: Status.CANCELLED,
      cancelledAt: Date.now(),
      cancelledBy: decodedToken.role,
    },
    { new: true, runValidators: true }
  );

  return cancelRide;
};

const myRides = async (userId: string) => {};

export const RiderService = {
  requestARide,
  cancelARide,
  myRides,
};
