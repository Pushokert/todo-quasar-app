export interface MonitoringEvent {
  type: 'error' | 'performance';
  name: string;
  details: Record<string, string | number>;
  timestamp: string;
}

const eventsBuffer: MonitoringEvent[] = [];

export function initMonitoring(dsn = 'mock-sentry-dsn'): void {
  if (!dsn) {
    return;
  }
  eventsBuffer.push({
    type: 'performance',
    name: 'monitoring_initialized',
    details: { status: 1 },
    timestamp: new Date().toISOString()
  });
}

export function captureSentryException(error: unknown): void {
  const message = error instanceof Error ? error.message : 'unknown_error';
  eventsBuffer.push({
    type: 'error',
    name: message,
    details: { handled: 1 },
    timestamp: new Date().toISOString()
  });
}

export function recordPerformanceMetric(metricName: string, durationMs: number): void {
  eventsBuffer.push({
    type: 'performance',
    name: metricName,
    details: { durationMs },
    timestamp: new Date().toISOString()
  });
}

export function getMonitoringEvents(): MonitoringEvent[] {
  return [...eventsBuffer];
}
