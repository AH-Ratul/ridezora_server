import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IRide, Status } from "./ride.interface";
import { Ride } from "./ride.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

//------------------- REQUEST A RIDE ----------------
const requestARide = async (payload: IRide) => {
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

const myRides = async (decodedToken: JwtPayload) => {
  const riderId = decodedToken.userId;

  const rides = await Ride.find({ rider: riderId });

  if (!rides) {
    throw new AppError(httpStatus.NOT_FOUND, "No Ride Found");
  }

  return rides;
};

export const RiderService = {
  requestARide,
  cancelARide,
  myRides,
};
