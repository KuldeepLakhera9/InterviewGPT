type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatLog(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogPayload {
    return {
      message,
      level,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {}),
    };
  }

  /* eslint-disable no-console */
  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment && !this.isTest) {
      console.debug('🐛 [DEBUG]', this.formatLog('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    if (!this.isTest) {
      console.info('ℹ️ [INFO]', this.formatLog('info', message, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (!this.isTest) {
      console.warn('⚠️ [WARN]', this.formatLog('warn', message, context));
    }
  }

  error(message: string, context?: Record<string, unknown>) {
    if (!this.isTest) {
      console.error('❌ [ERROR]', this.formatLog('error', message, context));
    }
  }
}

export const logger = new Logger();
