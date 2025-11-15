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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuditLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AuditLogService = AuditLogService_1 = class AuditLogService {
    auditLogRepository;
    logger = new common_1.Logger(AuditLogService_1.name);
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async create(auditLogData) {
        try {
            const { userId, ip_address, ...rest } = auditLogData;
            console.log('[BACKEND] Menerima audit log:', auditLogData);
            const auditLog = this.auditLogRepository.create({
                ...rest,
                ip_address: ip_address,
                user: userId ? { id: userId } : null,
            });
            const savedLog = await this.auditLogRepository.save(auditLog);
            console.log('[BACKEND] Berhasil menyimpan audit log:', savedLog);
            return savedLog;
        }
        catch (error) {
            console.error('[BACKEND] Error creating audit log:', error);
            throw error;
        }
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 20, search, action, module, start_date, end_date, } = query;
            const skip = (page - 1) * limit;
            const where = {};
            if (search) {
                where.description = (0, typeorm_2.Like)(`%${search}%`);
            }
            if (action)
                where.action = action;
            if (module)
                where.module = module;
            if (start_date && end_date) {
                where.timestamp = (0, typeorm_2.Between)(new Date(start_date), new Date(`${end_date}T23:59:59.999Z`));
            }
            const [data, total] = await this.auditLogRepository.findAndCount({
                where,
                relations: ['user'],
                order: { timestamp: 'DESC' },
                skip,
                take: limit,
            });
            return { data, total };
        }
        catch (error) {
            this.logger.error('Error finding audit logs:', error);
            throw error;
        }
    }
    async getStats() {
        try {
            const now = new Date();
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date(now);
            endOfToday.setHours(23, 59, 59, 999);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const todayStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfToday,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const weekStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfWeek,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const monthStats = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('audit_log.action', 'action')
                .addSelect('COUNT(*)', 'count')
                .where('audit_log.timestamp BETWEEN :start AND :end', {
                start: startOfMonth,
                end: endOfToday,
            })
                .groupBy('audit_log.action')
                .getRawMany();
            const modules = await this.auditLogRepository
                .createQueryBuilder('audit_log')
                .select('DISTINCT audit_log.module', 'module')
                .getRawMany();
            return {
                today: todayStats,
                week: weekStats,
                month: monthStats,
                modules: modules.map((m) => m.module),
            };
        }
        catch (error) {
            this.logger.error('Error getting stats:', error);
            throw error;
        }
    }
    async exportToExcel(query) {
        try {
            const { data } = await this.findAll({ ...query, limit: 1000 });
            return data;
        }
        catch (error) {
            this.logger.error('Error exporting to excel:', error);
            throw error;
        }
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map