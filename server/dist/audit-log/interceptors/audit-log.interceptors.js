"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("../audit-log.service");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogInterceptor = class AuditLogInterceptor {
    auditLogService;
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const method = req.method ?? 'GET';
        const url = req.originalUrl ?? req.url ?? '-';
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ??
            req.ip ??
            req.socket?.remoteAddress ??
            '-';
        return next.handle().pipe((0, operators_1.tap)(() => {
            void this.createAuditLog({
                userId: user?.user_id ?? null,
                method,
                url,
                ip,
                isSuccess: true,
            });
        }), (0, operators_1.catchError)((err) => {
            const safeError = err;
            void this.createAuditLog({
                userId: user?.user_id ?? null,
                method,
                url,
                ip,
                isSuccess: false,
                description: safeError?.message ?? 'Request failed',
            });
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
    async createAuditLog(data) {
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
        }
        catch (error) {
            console.error('Failed to write audit log');
        }
    }
    getActionFromMethod(method) {
        const map = {
            GET: audit_log_entity_1.ActionType.VIEW,
            POST: audit_log_entity_1.ActionType.CREATE,
            PUT: audit_log_entity_1.ActionType.UPDATE,
            PATCH: audit_log_entity_1.ActionType.UPDATE,
            DELETE: audit_log_entity_1.ActionType.DELETE,
        };
        return map[method] ?? audit_log_entity_1.ActionType.VIEW;
    }
    getModuleFromUrl(url) {
        const lower = url.toLowerCase();
        if (lower.includes('investasi'))
            return audit_log_entity_1.ModuleType.INVESTASI;
        if (lower.includes('market') || lower.includes('pasar'))
            return audit_log_entity_1.ModuleType.PASAR;
        if (lower.includes('likuiditas'))
            return audit_log_entity_1.ModuleType.LIKUIDITAS;
        if (lower.includes('operasional'))
            return audit_log_entity_1.ModuleType.OPERASIONAL;
        if (lower.includes('hukum'))
            return audit_log_entity_1.ModuleType.HUKUM;
        if (lower.includes('strategi'))
            return audit_log_entity_1.ModuleType.STRATEJIK;
        if (lower.includes('kepatuhan') || lower.includes('compliance'))
            return audit_log_entity_1.ModuleType.KEPATUHAN;
        if (lower.includes('reputasi'))
            return audit_log_entity_1.ModuleType.REPUTASI;
        if (lower.includes('user') || lower.includes('auth'))
            return audit_log_entity_1.ModuleType.USER_MANAGEMENT;
        return audit_log_entity_1.ModuleType.SYSTEM;
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptors.js.map