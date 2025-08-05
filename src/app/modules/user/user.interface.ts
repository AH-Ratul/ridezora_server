export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IVehicle {
  model?: string;
  licensePlate?: string;
  type?: string;
  color: string;
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
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: Role;
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  auths: IAuthProvider[];

  //driver specific
  vehicleInfo?: IVehicle;
  isApproved?: boolean;
}
