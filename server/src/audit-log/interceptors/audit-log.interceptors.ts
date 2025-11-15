import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../audit-log.service';
import { ActionType, ModuleType } from '../entities/audit-log.entity';
import type { Request } from 'express';

// TIPE USER sesuai entity kamu
interface SafeUser {
  user_id: number;
  role?: string;
  userID?: string;
}

// TIPE ERROR aman
interface SafeError {
  message?: string;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const user = req.user as SafeUser | undefined;
    const method: string = req.method ?? 'GET';
    const url: string = req.originalUrl ?? req.url ?? '-';

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      req.ip ??
      req.socket?.remoteAddress ??
      '-';

    return next.handle().pipe(
      tap(() => {
        void this.createAuditLog({
          userId: user?.user_id ?? null,
          method,
          url,
          ip,
          isSuccess: true,
        });
      }),

      catchError((err: unknown) => {
        const safeError = err as SafeError;

        void this.createAuditLog({
          userId: user?.user_id ?? null,
          method,
          url,
          ip,
          isSuccess: false,
          description: safeError?.message ?? 'Request failed',
        });

        return throwError(() => err);
      }),
    );
  }

  private async createAuditLog(data: {
    userId: number | null;
    method: string;
    url: string;
    ip: string;
    isSuccess: boolean;
    description?: string;
  }): Promise<void> {
    try {
      await this.auditLogService.create({
        userId: data.userId,
        action: this.getActionFromMethod(data.method),
        module: this.getModuleFromUrl(data.url),
        description: data.description ?? `${data.method} ${data.url}`,
        endpoint: data.url,
        ip_address: data.ip,
        isSuccess: data.isSuccess,
      });
    } catch (error) {
      console.error('Failed to write audit log');
    }
  }

  private getActionFromMethod(method: string): ActionType {
    const map: Record<string, ActionType> = {
      GET: ActionType.VIEW,
      POST: ActionType.CREATE,
      PUT: ActionType.UPDATE,
      PATCH: ActionType.UPDATE,
      DELETE: ActionType.DELETE,
    };
    return map[method] ?? ActionType.VIEW;
  }

  private getModuleFromUrl(url: string): ModuleType {
    const lower = url.toLowerCase();

    if (lower.includes('investasi')) return ModuleType.INVESTASI;
    if (lower.includes('market') || lower.includes('pasar'))
      return ModuleType.PASAR;
    if (lower.includes('likuiditas')) return ModuleType.LIKUIDITAS;
    if (lower.includes('operasional')) return ModuleType.OPERASIONAL;
    if (lower.includes('hukum')) return ModuleType.HUKUM;
    if (lower.includes('strategi')) return ModuleType.STRATEJIK;
    if (lower.includes('kepatuhan') || lower.includes('compliance'))
      return ModuleType.KEPATUHAN;
    if (lower.includes('reputasi')) return ModuleType.REPUTASI;
    if (lower.includes('user') || lower.includes('auth'))
      return ModuleType.USER_MANAGEMENT;

    return ModuleType.SYSTEM;
  }
}
