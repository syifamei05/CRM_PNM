import { ActionType, ModuleType } from '../entities/audit-log.entity';
export declare class CreateAuditLogDto {
    userId: number | null;
    action: ActionType;
    module: ModuleType;
    description: string;
    endpoint?: string;
    ip_address: string;
    isSuccess?: boolean;
    metadata?: Record<string, unknown>;
}
