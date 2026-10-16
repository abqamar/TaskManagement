
import { Request, Response } from "express";
import { HealthService } from "./health.service.js";
import { successResponse } from "../../common/models/api-response.js";

export class HealthController {
  private readonly healthService = new HealthService();

  getHealth = (_req: Request, res: Response): void => {
    const data = this.healthService.getHealth();

    res.status(200).json(successResponse(data));
  };
}
