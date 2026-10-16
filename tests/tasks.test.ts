
import {
  describe,
  it,
  expect,
  beforeEach,
  afterAll
} from "vitest";

import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/config/database.js";

describe("Task API Integration Tests", () => {

  // Clean tasks before each test.
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a task", async () => {
    const response = await request(app)
      .post("/api/v1/tasks")
      .send({
        title: "Learn CI/CD",
        description: "Create automated tests",
        priority: "HIGH",
        status: "TODO"
      });

    expect(response.status).toBe(201);
    expect(response.body.MessageCodes.StatusCode)
      .toBe(1);

    expect(response.body.Data.title)
      .toBe("Learn CI/CD");

    expect(response.body.Data.id)
      .toBeTypeOf("number");

    const task = await prisma.task.findUnique({
      where: { id: response.body.Data.id }
    });

    expect(task).not.toBeNull();
  });

  it("should retrieve all tasks", async () => {
    await prisma.task.create({
      data: {
        title: "First Task",
        priority: "MEDIUM"
      }
    });

    await prisma.task.create({
      data: {
        title: "Second Task",
        priority: "HIGH"
      }
    });

    const response = await request(app)
      .get("/api/v1/tasks");

    expect(response.status).toBe(200);
    expect(response.body.Data.items)
      .toHaveLength(2);

    expect(response.body.Data.pagination.total)
      .toBe(2);
  });

  it("should retrieve a task by ID", async () => {
    const task = await prisma.task.create({
      data: { title: "Find Me" }
    });

    const response = await request(app)
      .get(`/api/v1/tasks/${task.id}`);

    expect(response.status).toBe(200);
    expect(response.body.Data.id).toBe(task.id);
  });

  it("should update task status", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Complete This",
        status: "TODO"
      }
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .send({
        status: "COMPLETED"
      });

    expect(response.status).toBe(200);
    expect(response.body.Data.status)
      .toBe("COMPLETED");

    expect(response.body.Data.completedAt)
      .not.toBeNull();
  });

  it("should delete a task", async () => {
    const task = await prisma.task.create({
      data: { title: "Delete Me" }
    });

    const response = await request(app)
      .delete(`/api/v1/tasks/${task.id}`);

    expect(response.status).toBe(200);

    const deleted = await prisma.task.findUnique({
      where: { id: task.id }
    });

    expect(deleted).toBeNull();
  });

  it("should reject invalid task data", async () => {
    const response = await request(app)
      .post("/api/v1/tasks")
      .send({
        title: "Hi",
        priority: "INVALID"
      });

    expect(response.status).toBe(400);
    expect(response.body.MessageCodes.StatusCode)
      .toBe(400);
  });

  it("should return 404 for missing task", async () => {
    const response = await request(app)
      .get("/api/v1/tasks/999999");

    expect(response.status).toBe(404);
  });

});
