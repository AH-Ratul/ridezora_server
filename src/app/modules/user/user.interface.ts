import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED"
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  auths: IAuthProvider[];

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
