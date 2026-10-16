
import { prisma } from "../../config/database.js";
import type { Prisma } from "../../generated/prisma/client.js";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskListQuery
} from "./task.schema.js";

export class TaskRepository {

  async findAll(query: TaskListQuery) {
    const { page, limit, status, priority, search } = query;

    const where: Prisma.TaskWhereInput = {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(search ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      } : {})
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" }
        ]
      }),
      prisma.task.count({ where })
    ]);

    return {
      items: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: number) {
    return prisma.task.findUnique({
      where: { id }
    });
  }

  async create(data: CreateTaskDto) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate
          ? new Date(data.dueDate)
          : null,
        completedAt: data.status === "COMPLETED"
          ? new Date()
          : null
      }
    });
  }

  async update(
    id: number,
    data: UpdateTaskDto,
    completedAt?: Date | null
  ) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(data.dueDate !== undefined
          ? {
              dueDate: data.dueDate
                ? new Date(data.dueDate)
                : null
            }
          : {}),
        ...(completedAt !== undefined
          ? { completedAt }
          : {})
      }
    });
  }

  async delete(id: number) {
    return prisma.task.delete({
      where: { id }
    });
  }
}
