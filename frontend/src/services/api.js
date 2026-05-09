import axios from 'axios';

const API_BASE = '/api';

export const fetchReports = async () => {
  const res = await axios.get(`${API_BASE}/reports`);
  return res.data;
};

export const createReport = async (reportData) => {
  const res = await axios.post(`${API_BASE}/reports`, reportData);
  return res.data;
};

export const createReportWithImage = async (lat, lng, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('lat', lat);
  formData.append('lng', lng);
  const res = await axios.post(`${API_BASE}/reports/with-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};