import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { handleDuplicateError } from "../errorHelpers/helpers/handleDuplicateError";
import AppError from "../errorHelpers/AppError";
import { handleZodError } from "../errorHelpers/helpers/handleZodError";
import { TErrorSources } from "../interface/error.types";
import { handleCastError } from "../errorHelpers/helpers/handleCastError";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorSources: TErrorSources[] = [];
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
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
    errorSources,
    err: env.NODE_ENV === "development" ? err : null,
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
};
