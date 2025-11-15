// audit-log/services/audit-log.services.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5530/api/v1';

class AuditLogService {
  api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  // PERBAIKAN: Tambahkan debug dan fix IP/user issues
  async createAuditLog(auditLogData: { action: string; module: string; description: string; endpoint?: string; ipAddress?: string; isSuccess?: boolean; userId?: number | null; metadata?: Record<string, unknown> }) {
    try {
      // DEBUG: Cek localStorage
      console.log('🔍 [DEBUG] localStorage user:', localStorage.getItem('user'));

      // Dapatkan user info dari localStorage - PERBAIKAN
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 [DEBUG] Parsed user data:', userData);

      // Dapatkan IP - PERBAIKAN dengan fallback
      let clientIP = 'unknown';
      try {
        clientIP = await this.getClientIP();
        console.log('🔍 [DEBUG] Client IP:', clientIP);
      } catch (ipError) {
        console.warn('⚠️ Tidak bisa dapatkan IP external, gunakan fallback');
        clientIP = 'local';
      }

      // Format payload - PERBAIKAN field mapping
      const payload = {
        action: auditLogData.action, // Langsung pakai string, backend handle enum
        module: auditLogData.module, // Langsung pakai string
        description: auditLogData.description,
        endpoint: auditLogData.endpoint || window.location.pathname,
        ipAddress: auditLogData.ipAddress || clientIP,
        isSuccess: auditLogData.isSuccess !== undefined ? auditLogData.isSuccess : true,
        // PERBAIKAN: Cari userId dari berbagai kemungkinan field
        userId: auditLogData.userId ?? ((userData.user_id ?? null) || userData.user_id || userData.id || userData.userId || null),
        metadata: auditLogData.metadata && Object.keys(auditLogData.metadata).length > 0 ? auditLogData.metadata : null,
      };

      console.log('🔄 [AUDIT] Mengirim payload:', payload);

      const response = await this.api.post('/audit-logs', payload);
      console.log('✅ [AUDIT] Berhasil membuat log:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [AUDIT] Gagal membuat log:', error);
      console.error('❌ [AUDIT] Error response:', error.response?.data);

      // Jangan throw error agar tidak mengganggu flow utama
      return null;
    }
  }

  // PERBAIKAN: getClientIP dengan timeout
  async getClientIP(): Promise<string> {
    try {
      // Timeout setelah 3 detik
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('⚠️ Gagal mendapatkan IP external:', error);

      // Fallback: coba dapatkan IP dari connection info
      try {
        // @ts-ignore - Property experimental mungkin ada di browser
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.localAddress) {
          return connection.localAddress;
        }
      } catch (e) {
        // Ignore
      }

      return 'unknown';
    }
  }

  // Get all audit logs dengan filter
  async getAuditLogs(params = {}) {
    try {
      const response = await this.api.get('/audit-logs', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get stats
  async getAuditLogStats() {
    try {
      const response = await this.api.get('/audit-logs/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export to Excel
  async exportAuditLogs(params = {}) {
    try {
      const response = await this.api.get('/audit-logs/export', {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Terjadi kesalahan pada server';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message);
      }
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Terjadi kesalahan yang tidak diketahui');
    }
  }
}

export default new AuditLogService();
