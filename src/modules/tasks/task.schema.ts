
import { z } from "zod";

export const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
]);

export const taskPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT"
]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(200),

  description: z.string().trim().max(5000)
    .nullable().optional(),

  status: taskStatusSchema.default("TODO"),

  priority: taskPrioritySchema.default("MEDIUM"),

  dueDate: z.string()
    .datetime({ offset: true })
    .nullable()
    .optional()
}).strict();

export const updateTaskSchema =
  createTaskSchema.partial();

export const taskIdSchema = z.coerce.number<number>()
  .int()
  .positive();

export const taskListSchema = z.object({
  page: z.coerce.number<number>()
    .int().min(1).default(1),

  limit: z.coerce.number<number>()
    .int().min(1).max(100).default(10),

  status: taskStatusSchema.optional(),

  priority: taskPrioritySchema.optional(),

  search: z.string().trim().max(200).optional()
});

export type CreateTaskDto =
  z.infer<typeof createTaskSchema>;

export type UpdateTaskDto =
  z.infer<typeof updateTaskSchema>;

export type TaskListQuery =
  z.infer<typeof taskListSchema>;
