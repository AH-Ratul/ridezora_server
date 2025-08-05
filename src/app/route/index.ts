import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { riderRoute } from "../modules/rider/rider.route";

export const appRoute = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute
  },
  {
    path: "/rides",
    route: riderRoute
  }
];

moduleRoutes.forEach((route) => {
  appRoute.use(route.path, route.route);
});
