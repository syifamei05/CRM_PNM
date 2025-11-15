import type { SafeUser } from '../audit-log/interceptors/audit-log.interceptors';

declare module 'express-serve-static-core' {
  interface Request {
    user?: SafeUser;
  }
}
