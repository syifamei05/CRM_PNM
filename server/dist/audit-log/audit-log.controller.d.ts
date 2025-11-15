import type { Response, Request } from 'express';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
export declare class AuditLogController {
    private readonly auditLogService;
    constructor(auditLogService: AuditLogService);
    create(dto: CreateAuditLogDto, req: Request): Promise<import("./entities/audit-log.entity").AuditLog>;
    findAll(query: AuditLogQueryDto): Promise<{
        data: import("./entities/audit-log.entity").AuditLog[];
        total: number;
    }>;
    getStats(): Promise<{
        today: any[];
        week: any[];
        month: any[];
        modules: any[];
    }>;
    exportToExcel(query: AuditLogQueryDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
