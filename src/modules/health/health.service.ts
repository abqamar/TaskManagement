
export class HealthService {
  getHealth() {
    return {
      status: "healthy",
      application: "Task Management API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
