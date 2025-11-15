import { Controller, Get, Post, Body, Query, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  async create(@Body() dto: CreateAuditLogDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    let ipAddress: string | undefined;
    if (typeof forwarded === 'string') {
      ipAddress = forwarded.split(',')[0].trim();
    } else if (Array.isArray(forwarded)) {
      ipAddress = forwarded[0];
    } else if (req.socket?.remoteAddress) {
      ipAddress = req.socket.remoteAddress;
    }
    dto.ip_address = ipAddress ?? '';
    return await this.auditLogService.create(dto);
  }

  @Get()
  async findAll(@Query() query: AuditLogQueryDto) {
    return await this.auditLogService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return await this.auditLogService.getStats();
  }

  @Get('export')
  async exportToExcel(@Query() query: AuditLogQueryDto, @Res() res: Response) {
    const data = await this.auditLogService.exportToExcel(query);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`,
    );

    return res.json(data);
  }
}
