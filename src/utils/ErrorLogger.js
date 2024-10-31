import { promises } from 'fs';
import path from 'path';

export class ErrorLogger {
  constructor(options = {}) {
    this.logDir = options.logDir || 'logs';
    this.logFile = path.join(this.logDir, 'error.log');
    this.createLogDir();
  }

  async createLogDir() {
    try {
      await promises.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  async logError(error, additionalInfo = {}) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        ...additionalInfo,
      };

      const logMessage = `
[${errorLog.timestamp}]
Error: ${errorLog.message}
Stack: ${errorLog.stack}
Additional Info: ${JSON.stringify(additionalInfo, null, 2)}
----------------------------------------
`;

      await promises.appendFile(this.logFile, logMessage);
      console.error('Error logged to file:', this.logFile);

      return errorLog;
    } catch (logError) {
      console.error('Failed to log error to file:', logError);
      return null;
    }
  }
}
