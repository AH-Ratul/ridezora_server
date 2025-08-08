import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { rideRoute } from "../modules/ride/ride.route";
import { adminRoute } from "../modules/admin/admin.route";
import { driverRoute } from "../modules/driver/driver.route";

export const appRoute = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/rides",
    route: rideRoute,
  },
  {
    path: "/drivers",
    route: driverRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
];

moduleRoutes.forEach((route) => {
  appRoute.use(route.path, route.route);
});
