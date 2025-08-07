import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../ride/ride.model";
import { PaymentStatus, Status } from "../ride/ride.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";

//-------------------- AVAILABLE RIDES -------------------
const getAvailableRides = async (decodedToken: JwtPayload) => {
  console.log(decodedToken);
  const availableRides = await Ride.find({
    driver: decodedToken.userId,
    status: Status.REQUESTED,
  });

  if (availableRides.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No Ride found");
  }

  return availableRides;
};

//------------------- ACCEPT RIDE -------------------
const acceptRide = async (rideId: string, decodedToken: JwtPayload) => {
  const ride = await Ride.findById({
    _id: rideId,
    driver: decodedToken.userId,
  });

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  ride.status = Status.ACCEPTED;
  ride.acceptedAt = Date.now() as unknown as Date;
  await ride.save();

  return ride;
};

//----------------- UPDATE RIDE STATUS ------------------
const updateRideStatus = async (
  rideId: string,
  status: string,
  decodedToken: JwtPayload
) => {
  const driverId = decodedToken.userId;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.driver.toString() !== driverId.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not assign to this ride");
  }

  if (status === Status.IN_TRANSIT) {
    if (ride.status !== Status.ACCEPTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot move to IN_TRANSIT from ${ride.status}`
      );
    }

    ride.status = status;
    ride.inTransit = Date.now() as unknown as Date;
    await ride.save();
  } else if (status === Status.COMPLETED) {
    if (ride.status !== Status.IN_TRANSIT) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot complete ride from status ${ride.status}`
      );
    }

    ride.status = status;
    ride.completedAt = Date.now() as unknown as Date;
    ride.paymentStatus = PaymentStatus.PAID;
    await ride.save();
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid Status transition from ${ride.status} to ${status}`
    );
  }

  return ride;
};

//---------------- CANCEL RIDE ---------------
const cancelARide = async (rideId: string, decodedToken: JwtPayload) => {
  const ride = await Ride.findOne({
    _id: rideId,
    driver: decodedToken.userId,
    status: Status.REQUESTED,
  });

  if (!ride) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can not cancel the Ride.");
  }

  ride.status = Status.CANCELLED;
  ride.cancelledAt = Date.now() as unknown as Date;
  ride.cancelledBy = decodedToken.role;
  await ride.save();

  return ride;
};

const myRides = async (decodedToken: JwtPayload) => {
  const driverId = decodedToken.userId;

  const rides = await Ride.aggregate([
    {
      $match: {
        driver: new Types.ObjectId(driverId),
        status: Status.COMPLETED,
        fare: { $gte: 0 },
      },
    },
    {
      $project: {
        _id: 0,
        pickUpLocation: 1,
        destination: 1,
        fare: 1,
        status: 1,
        paymentStatus: 1,
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$fare" },
        totalRides: { $sum: 1 },
        rides: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalEarnings: 1,
        totalRides: 1,
        rides: 1,
      },
    },
  ]);

  return rides;
};

export const DriverService = {
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  cancelARide,
  myRides,
};
