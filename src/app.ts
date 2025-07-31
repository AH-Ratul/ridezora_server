import express, { Request, Response } from "express";
import { appRoute } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.use(express.json());

app.use("/api/v1", appRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("RideZora app running...");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
