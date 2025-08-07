import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { rideRoute } from "../modules/ride/ride.route";

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
];

moduleRoutes.forEach((route) => {
  appRoute.use(route.path, route.route);
});
