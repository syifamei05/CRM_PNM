import { useState, useEffect } from 'react';
import { useAuditLog } from './audit-log.hooks';
export const useAuditLogStats = () => {
  const [stats, setStats] = useState({
    today: [],
    week: [],
    month: [],
    modules: [],
  });

  const { loading, error, data, getStats: fetchStats, clearError } = useAuditLog();

  // Load stats
  const loadStats = async () => {
    try {
      await fetchStats();
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Update stats ketika data berubah
  useEffect(() => {
    if (data) {
      setStats({
        today: data.today || [],
        week: data.week || [],
        month: data.month || [],
        modules: data.modules || [],
      });
    }
  }, [data]);

  // Initial load
  useEffect(() => {
    loadStats();
  }, []);

  // Refresh stats
  const refreshStats = () => {
    loadStats();
  };

  return {
    stats,
    loading: loading,
    error,
    refreshStats,
    clearError,
  };
};
