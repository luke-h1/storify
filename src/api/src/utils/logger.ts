/* eslint-disable no-console */
import format from 'date-fns/format';

class Logger {
  get now() {
    const date = Date.now();
    return format(date, 'yyyy-MM-dd, HH:mm:ss');
  }

  log(type: string, message: string) {
    console.log(`[${this.now}[${type}]: ${message}]`);
  }

  error(type: string, message: string) {
    console.error(`[${this.now}[${type}]: ${message}]`);
  }
}
export const logger = new Logger();
