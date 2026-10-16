
export class HealthService {
  getHealth() {
    return {
      status: "unhealthy",
      application: "Task Management API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
