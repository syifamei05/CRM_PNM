import { ActionType, ModuleType } from '../entities/audit-log.entity';
export declare class AuditLogQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    action?: ActionType;
    module?: ModuleType;
    start_date?: string;
    end_date?: string;
}
