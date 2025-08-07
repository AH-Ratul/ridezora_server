import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "../driver/driver.controller";
import { RiderController } from "./ride.controller";

export const rideRoute = Router();

//-------- RIDER'S ROUTES -----------
rideRoute.post("/request", checkAuth(Role.RIDER), RiderController.requestARide);
rideRoute.patch(
  "/cancel/:id",
  checkAuth(Role.RIDER),
  RiderController.cancelARide
);
rideRoute.get("/me", checkAuth(Role.RIDER), RiderController.myRides);

// ----- DRIVER'S ROUTES -----------
rideRoute.get(
  "/available",
  checkAuth(Role.DRIVER),
  DriverController.getAvailableRides
);

rideRoute.get(
  "/driver-earnings",
  checkAuth(Role.DRIVER),
  DriverController.myRides
);

rideRoute.patch(
  "/accept/:id",
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);

rideRoute.patch(
  "/status/:id",
  checkAuth(Role.DRIVER),
  DriverController.updateRideStatus
);

rideRoute.patch(
  "/cancel/:id",
  checkAuth(Role.DRIVER),
  DriverController.cancelARide
);
