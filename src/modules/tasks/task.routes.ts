
import { Router } from "express";
import { TaskController } from "./task.controller.js";

const router = Router();
const controller = new TaskController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
