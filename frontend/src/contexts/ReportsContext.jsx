import { createContext, useContext, useState, useEffect } from 'react';
import { fetchReports } from '../services/api';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const addReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <ReportsContext.Provider value={{ reports, loading, addReport, refresh: loadReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);