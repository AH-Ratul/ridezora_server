import { Router } from "express";
import { userRoute } from "../modules/user/user.route";

export const appRoute = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
];

moduleRoutes.forEach((route) => {
  appRoute.use(route.path, route.route);
});
