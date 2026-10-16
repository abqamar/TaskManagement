
import { describe, it, expect } from "vitest";

import {
  successResponse,
  errorResponse
} from "../src/common/models/api-response.js";

describe("API Response Helpers", () => {

  it("should generate a successful response", () => {
    const result = successResponse({
      id: 1,
      name: "Test User"
    });

    expect(result.Data?.id).toBe(1);
    expect(result.MessageCodes.StatusCode).toBe(1);
    expect(result.MessageCodes.StatusDescription)
      .toBe("Success");
  });

  it("should generate an error response", () => {
    const result = errorResponse(
      "Task not found",
      404
    );

    expect(result.Data).toBeNull();
    expect(result.MessageCodes.StatusCode).toBe(404);
    expect(result.MessageCodes.StatusDescription)
      .toBe("Task not found");
  });

});
