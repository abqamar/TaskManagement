
import {
  ErrorRequestHandler
} from "express";

import {
  errorResponse
} from "../common/models/api-response.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error("API Error:", err);

  res.status(500).json(
    errorResponse("Internal server error")
  );
};
