
import { Router } from "express";

import healthRoutes from "../modules/health/health.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/tasks", taskRoutes);

export default router;
