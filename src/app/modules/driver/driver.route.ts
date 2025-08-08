import { Router } from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const driverRoute = Router()

driverRoute.get(
  "/available",
  checkAuth(Role.DRIVER),
  DriverController.getAvailableRides
);

driverRoute.get(
  "/driver-earnings",
  checkAuth(Role.DRIVER),
  DriverController.myRides
);

driverRoute.patch(
  "/accept/:id",
  checkAuth(Role.DRIVER),
  DriverController.acceptRide
);

driverRoute.patch(
  "/status/:id",
  checkAuth(Role.DRIVER),
  DriverController.updateRideStatus
);

driverRoute.patch(
  "/cancel/:id",
  checkAuth(Role.DRIVER),
  DriverController.cancelARide
);