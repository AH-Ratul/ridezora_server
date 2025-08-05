import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

export const userRoute = Router();

userRoute.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
userRoute.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);

userRoute.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.getSingleUser
);
userRoute.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);
