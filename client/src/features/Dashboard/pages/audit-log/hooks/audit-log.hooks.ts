// audit-log/hooks/audit-log.hooks.ts
import { useState, useCallback } from 'react';
import auditLogServices from '../services/audit-log.services';

interface AdditionalLogData {
  endpoint?: string;
  ipAddress?: string;
  isSuccess?: boolean;
  userId?: number | null;
  metadata?: Record<string, unknown>;
}

interface AuditLogResponse {
  data: any;
  total?: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  module?: string;
  start_date?: string;
  end_date?: string;
}

export const useAuditLog = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditLogResponse | null>(null);

  // Helper function untuk create log dengan format standar
  const createLog = useCallback(
    async (logData: { action: string; module: string; description: string; endpoint?: string; ipAddress?: string; isSuccess?: boolean; userId?: number | null; metadata?: Record<string, unknown> }): Promise<any> => {
      try {
        const result = await auditLogServices.createAuditLog(logData);
        return result;
      } catch (error) {
        console.error('Failed to create audit log:', error);
        return null;
      }
    },
    []
  );

  // Helper functions untuk action yang umum
  const logCreate = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'CREATE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logUpdate = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'UPDATE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logDelete = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'DELETE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logView = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'VIEW',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logExport = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'EXPORT',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logLogin = useCallback(
    async (description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'LOGIN',
        module: 'USER',
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logLogout = useCallback(
    async (description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'LOGOUT',
        module: 'USER',
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  // Get audit logs dengan filter
  const getAuditLogs = useCallback(async (params: PaginationParams = {}): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.getAuditLogs(params);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get stats
  const getStats = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.getAuditLogStats();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(async (params: PaginationParams = {}): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.exportAuditLogs(params);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Reset state
  const reset = useCallback((): void => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    // State
    loading,
    error,
    data,

    // Helper functions untuk logging
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logExport,
    logLogin,
    logLogout,

    // CRUD Operations
    getAuditLogs,
    getStats,
    exportToExcel,

    // Utility functions
    clearError,
    reset,
  };
};

// Export types untuk digunakan di komponen lain
export type { AdditionalLogData, AuditLogResponse, PaginationParams };
