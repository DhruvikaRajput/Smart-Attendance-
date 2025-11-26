import { useState, useEffect } from 'react';
import { getAnalysisSummary } from '../api/api';

export function useAnalysis(range = 7, explain = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getAnalysisSummary(range, explain);
      setData(summary);
    } catch (err) {
      setError(err);
      console.error('Error fetching analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [range, explain]);

  return { data, loading, error, refetch: fetchAnalysis };
}

