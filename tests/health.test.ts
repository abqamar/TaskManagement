
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {

  it("should report healthy status", async () => {
    const response = await request(app)
      .get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.Data.status)
      .toBe("healthy");
  });

});
