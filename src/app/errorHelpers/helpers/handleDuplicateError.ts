import { TGenericErrorResponse } from "../../interface/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err?.errorResponse?.errmsg?.match(/"([^"]*)"/);
  const value = match?.[1] || "Duplicate value";

  return {
    statusCode: 400,
    message: `${value} already exists!!`,
  }; 
};
