import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
export declare class AuditLogService {
    private readonly auditLogRepository;
    private readonly logger;
    constructor(auditLogRepository: Repository<AuditLog>);
    create(auditLogData: CreateAuditLogDto): Promise<AuditLog>;
    findAll(query: AuditLogQueryDto): Promise<{
        data: AuditLog[];
        total: number;
    }>;
    getStats(): Promise<{
        today: any[];
        week: any[];
        month: any[];
        modules: any[];
    }>;
    exportToExcel(query: AuditLogQueryDto): Promise<AuditLog[]>;
}
