
import express from "express";
import cors from "cors";
import helmet from "helmet";

import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { errorResponse } from "./common/models/api-response.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1", apiRoutes);

app.use((_req, res) => {
  res.status(404).json(
    errorResponse("Endpoint not found", 404)
  );
});

app.use(errorHandler);

export default app;
