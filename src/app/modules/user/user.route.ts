import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoute = Router();

userRoute.post("/register", UserController.createUser);