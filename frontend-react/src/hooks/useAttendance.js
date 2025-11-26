import { useState, useEffect } from 'react';
import { getAttendance } from '../api/api';

export function useAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return { attendance, loading, error, refetch: fetchAttendance };
}

