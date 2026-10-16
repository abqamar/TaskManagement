
import type { Request, Response } from "express";

import { TaskService } from "./task.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskListSchema
} from "./task.schema.js";

import {
  successResponse
} from "../../common/models/api-response.js";

export class TaskController {
  private readonly service = new TaskService();

  getAll = async (req: Request, res: Response) => {
    const query = taskListSchema.parse(req.query);
    const result = await this.service.getAll(query);

    res.status(200).json(successResponse(result));
  };

  getById = async (req: Request, res: Response) => {
    const id = taskIdSchema.parse(req.params.id);
    const task = await this.service.getById(id);

    res.status(200).json(successResponse(task));
  };

  create = async (req: Request, res: Response) => {
    const dto = createTaskSchema.parse(req.body);
    const task = await this.service.create(dto);

    res.status(201).json(
      successResponse(task, "Task created successfully")
    );
  };

  update = async (req: Request, res: Response) => {
    const id = taskIdSchema.parse(req.params.id);
    const dto = updateTaskSchema.parse(req.body);

    const task = await this.service.update(id, dto);

    res.status(200).json(
      successResponse(task, "Task updated successfully")
    );
  };

  delete = async (req: Request, res: Response) => {
    const id = taskIdSchema.parse(req.params.id);

    await this.service.delete(id);

    res.status(200).json(
      successResponse(null, "Task deleted successfully")
    );
  };
}
