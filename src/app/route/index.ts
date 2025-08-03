import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.route";

export const appRoute = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute
  }
];

moduleRoutes.forEach((route) => {
  appRoute.use(route.path, route.route);
});
