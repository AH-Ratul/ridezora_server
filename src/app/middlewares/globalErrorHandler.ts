import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof Error) {
    statusCode = 500;
    message = err?.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
};
