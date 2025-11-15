import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere } from 'typeorm';
import { AuditLog, ActionType, ModuleType } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(auditLogData: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const { userId, ip_address, ...rest } = auditLogData;

      console.log('[BACKEND] Menerima audit log:', auditLogData);

      const auditLog = this.auditLogRepository.create({
        ...rest,
        ip_address: ip_address, // ⬅⬅⬅ FIX terpenting
        user: userId ? ({ id: userId } as any) : null,
      });

      const savedLog = await this.auditLogRepository.save(auditLog);
      console.log('[BACKEND] Berhasil menyimpan audit log:', savedLog);

      return savedLog;
    } catch (error) {
      console.error('[BACKEND] Error creating audit log:', error);
      throw error;
    }
  }

  async findAll(query: AuditLogQueryDto) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        action,
        module,
        start_date,
        end_date,
      } = query;

      const skip = (page - 1) * limit;

      const where: FindOptionsWhere<AuditLog> = {};

      if (search) {
        where.description = Like(`%${search}%`);
      }
      if (action) where.action = action;
      if (module) where.module = module;

      if (start_date && end_date) {
        where.timestamp = Between(
          new Date(start_date),
          new Date(`${end_date}T23:59:59.999Z`),
        );
      }

      const [data, total] = await this.auditLogRepository.findAndCount({
        where,
        relations: ['user'],
        order: { timestamp: 'DESC' },
        skip,
        take: limit,
      });

      return { data, total };
    } catch (error) {
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
    } catch (error) {
      this.logger.error('Error getting stats:', error);
      throw error;
    }
  }

  async exportToExcel(query: AuditLogQueryDto): Promise<AuditLog[]> {
    try {
      const { data } = await this.findAll({ ...query, limit: 1000 });
      return data;
    } catch (error) {
      this.logger.error('Error exporting to excel:', error);
      throw error;
    }
  }
}
