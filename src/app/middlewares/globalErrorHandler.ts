import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { handleDuplicateError } from "../errorHelpers/helpers/handleDuplicateError";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
  } else if (err instanceof Error) {
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
