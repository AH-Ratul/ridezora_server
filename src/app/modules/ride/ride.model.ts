import { model, Schema } from "mongoose";
import { IRide, PaymentStatus, Status } from "./ride.interface";

const rideSchema = new Schema<IRide>(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: { type: Number },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    requestedAt: { type: Date, default: Date.now() },
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Ride = model<IRide>("Ride", rideSchema);
