
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../common/errors/app-error.js";
import { errorResponse } from "../common/models/api-response.js";

import {
  Prisma
} from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues
      .map(issue =>
        `${issue.path.join(".") || "request"}: ${issue.message}`
      )
      .join("; ");

    res.status(400).json(
      errorResponse(message, 400)
    );
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      errorResponse(err.message, err.statusCode)
    );
    return;
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (err.code === "P2025") {
      res.status(404).json(
        errorResponse("Record not found", 404)
      );
      return;
    }

    if (err.code === "P2002") {
      res.status(409).json(
        errorResponse("Record already exists", 409)
      );
      return;
    }
  }

  console.error("Unexpected API error:", err);

  res.status(500).json(
    errorResponse("Internal server error", 500)
  );
};
