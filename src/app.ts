import express, { Request, Response } from "express";
import { appRoute } from "./app/route";

const app = express();

app.use(express.json());

app.use("/api/v1", appRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("RideZora app running...");
});

export default app;
