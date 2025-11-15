import { useState, useEffect, useCallback } from 'react';
import { useAuditLog } from './audit-log.hooks';

export const useAuditLogList = (initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    ...initialParams,
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const { loading, error, data, getAuditLogs: fetchAuditLogs, clearError } = useAuditLog();

  // Load audit logs
  const loadAuditLogs = useCallback(
    async (newParams = {}) => {
      const mergedParams = { ...params, ...newParams };
      setParams(mergedParams);

      try {
        const result = await fetchAuditLogs(mergedParams);
        if (result) {
          setAuditLogs(result.data || []);
          setTotal(result.total || 0);
          setPagination({
            page: mergedParams.page,
            limit: mergedParams.limit,
            totalPages: Math.ceil((result.total || 0) / mergedParams.limit),
          });
        }
      } catch (err) {
        // Error sudah dihandle oleh useAuditLog
        console.error('Failed to load audit logs:', err);
      }
    },
    [params, fetchAuditLogs]
  );

  // Initial load
  useEffect(() => {
    loadAuditLogs();
  }, []);

  // Search handler
  const handleSearch = useCallback(
    (searchTerm) => {
      loadAuditLogs({ search: searchTerm, page: 1 });
    },
    [loadAuditLogs]
  );

  // Filter handler
  const handleFilter = useCallback(
    (filters) => {
      loadAuditLogs({ ...filters, page: 1 });
    },
    [loadAuditLogs]
  );

  // Pagination handler
  const handlePageChange = useCallback(
    (newPage) => {
      loadAuditLogs({ page: newPage });
    },
    [loadAuditLogs]
  );

  // Refresh data
  const refresh = useCallback(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  return {
    // State
    auditLogs,
    total,
    pagination,
    loading,
    error,

    // Actions
    handleSearch,
    handleFilter,
    handlePageChange,
    refresh,
    clearError,

    // Current params
    currentParams: params,
  };
};
