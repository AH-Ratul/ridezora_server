import { Types } from "mongoose";

export enum Status {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export interface IRide {
  _id?: string;
  rider: Types.ObjectId;
  driver: Types.ObjectId;
  pickUpLocation: string;
  destination: string;
  fare?: number;
  status?: Status;
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  paymentStatus?: PaymentStatus;
}
