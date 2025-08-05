import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      min: 11,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    picture: String,
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    auths: [authProviderSchema],

    // rider only
    defaultLocation: String,
    paymentMethod: String,
    rideHistory: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
    },

    // driver only
    vehicleInfo: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    isAvailable: Boolean,
    currentLocation: String,
    totalRides: Number,
    licenseNumber: String,
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
