import { model, Schema } from "mongoose";
import {
  IAuthProvider,
  IsActive,
  IsAvailable,
  IUser,
  Role,
} from "./user.interface";

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
      default: Role.RIDER,
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

    // driver only
    vehicleInfo: {
      model: { type: String },
      licensePlate: { type: String },
      type: { type: String },
      color: { type: String },
    },
    isApproved: {
      type: Boolean,
    },
    availability: {
      type: String,
      enum: Object.values(IsAvailable),
    },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
