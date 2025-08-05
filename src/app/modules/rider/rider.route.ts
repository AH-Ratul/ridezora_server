import { Router } from "express";
import { RiderController } from "./rider.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const riderRoute = Router();

riderRoute.post(
  "/request",
  checkAuth(Role.RIDER),
  RiderController.requestARide
);
riderRoute.patch(
  "/cancel/:id",
  checkAuth(Role.RIDER),
  RiderController.cancelARide
);
