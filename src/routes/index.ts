
import { Router } from "express";
import healthRoutes from "../modules/health/health.routes.js";

const router = Router();

router.use("/health", healthRoutes);

// Future modules:
// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/tasks", taskRoutes);
// router.use("/projects", projectRoutes);

export default router;
