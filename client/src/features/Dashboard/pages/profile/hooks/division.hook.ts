import { useEffect, useState, useCallback } from 'react';
import { DivisionService } from '../services/division.services';

interface Division {
  divisi_id: number;
  name: string;
  users?: any[];
}

export const useDivision = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDivisions = useCallback(async () => {
    try {
      const res = await DivisionService.getAllDivisions();
      setDivisions(res);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  return {
    divisions,
    loading,
    error,
    refetch: fetchDivisions,
  };
};
