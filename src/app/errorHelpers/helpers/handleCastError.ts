import { CastError } from "mongoose";
import { TGenericErrorResponse } from "../../interface/error.types";

export const handleCastError = (err: CastError): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}. Please provide a valid ${err.kind}`,
  };
};
