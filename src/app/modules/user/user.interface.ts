import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: Role;
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;

  // rider specific
  defaultLocation?: string;
  paymentMethod?: string;
  rideHistory?: Types.ObjectId[];

  //driver specific
  vehicleInfo?: Types.ObjectId;
  isAvailable?: boolean;
  currentLocation?: string;
  totalRides?: number;
  licenseNumber?: string;
  approved?: boolean;
}
