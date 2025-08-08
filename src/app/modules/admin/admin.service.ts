import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Ride } from "../ride/ride.model";

//------------------ GET ALL USERS -----------------
const getAllUsers = async () => {
  const allUsers = await User.find({
    role: Role.RIDER,
  });

  const users = allUsers.map((user) => {
    const { password: pass, ...rest } = user.toObject();
    return rest;
  });

  return users;
};

//------------------- GET ALL DRIVERS -------------------
const getAllDrivers = async () => {
  const allDrivers = await User.find({
    role: Role.DRIVER,
  });

  const drivers = allDrivers.map((driver) => {
    const { password: pass, ...rest } = driver.toObject();
    return rest;
  });

  return drivers;
};

//------------- GET ALL RIDES -------------------
const getAllRides = async () => {
  const rides = await Ride.find().populate("rider driver", "name email");

  return rides;
};

//------------------------ APPROVE DRIVER ------------------
const approveADriver = async (driverId: string) => {
  const driver = await User.findByIdAndUpdate(
    driverId,
    {
      isApproved: true,
    },
    { new: true }
  );

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not Found");
  }

  return driver;
};

//------------------- SUSPEND DRIVER ---------------------
const suspendADriver = async (driverId: string) => {
  const driver = await User.findByIdAndUpdate(
    driverId,
    {
      isActive: IsActive.SUSPENDED,
    },
    { new: true }
  );

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not Found");
  }

  return driver;
};

//---------------------- BLOCK USER --------------------
const blockAUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.BLOCKED,
    },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  return user;
};

const unblockUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.ACTIVE,
    },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  return user;
};

export const AdminService = {
  approveADriver,
  suspendADriver,
  blockAUser,
  unblockUser,
  getAllDrivers,
  getAllUsers,
  getAllRides,
};
