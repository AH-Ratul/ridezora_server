import express, { Request, Response } from "express";
import { appRoute } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import cors from "cors";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import { env } from "./app/config/env";
import './app/config/passport'; 

const app = express();

app.use(expressSession({
    secret: env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", appRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("RideZora app running...");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
