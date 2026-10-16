
import { AppError } from "../../common/errors/app-error.js";
import { TaskRepository } from "./task.repository.js";

import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskListQuery
} from "./task.schema.js";

export class TaskService {
  private readonly repository = new TaskRepository();

  async getAll(query: TaskListQuery) {
    return this.repository.findAll(query);
  }

  async getById(id: number) {
    const task = await this.repository.findById(id);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return task;
  }

  async create(data: CreateTaskDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateTaskDto) {
    const existing = await this.getById(id);

    if (Object.keys(data).length === 0) {
      throw new AppError(400, "No fields provided");
    }

    let completedAt: Date | null | undefined;

    if (data.status === "COMPLETED") {
      completedAt = existing.completedAt ?? new Date();
    } else if (
      data.status !== undefined &&
      existing.status === "COMPLETED"
    ) {
      completedAt = null;
    }

    return this.repository.update(id, data, completedAt);
  }

  async delete(id: number) {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
