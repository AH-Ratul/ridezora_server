import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";

export const adminRoute = Router();

adminRoute.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllUsers
);

adminRoute.get(
  "/all-drivers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllDrivers
);

adminRoute.get(
  "/rides",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllRides
);

adminRoute.patch(
  "/driver-approved/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.approveADriver
);

adminRoute.patch(
  "/driver-suspend/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.suspendADriver
);

adminRoute.patch(
  "/block/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.blockAUser
);

adminRoute.patch(
  "/unblock/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.unblockUser
);
