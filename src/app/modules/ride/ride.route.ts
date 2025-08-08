import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RiderController } from "./ride.controller";

export const rideRoute = Router();

rideRoute.post("/request", checkAuth(Role.RIDER), RiderController.requestARide);
rideRoute.patch(
  "/cancel/:id",
  checkAuth(Role.RIDER),
  RiderController.cancelARide
);
rideRoute.get("/me", checkAuth(Role.RIDER), RiderController.myRides);
