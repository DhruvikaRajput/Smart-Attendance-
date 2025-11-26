import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students
export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

// Attendance
export const getAttendance = async () => {
  const response = await api.get('/attendance');
  return response.data;
};

// Enroll student
export const enrollStudent = async (name, imageBase64List) => {
  const response = await api.post('/enroll', {
    name,
    image_base64_list: imageBase64List,
  });
  return response.data;
};

// Recognize face
export const recognizeFace = async (imageBase64) => {
  const response = await api.post('/recognize', {
    image_base64: imageBase64,
  });
  return response.data;
};

// Mark attendance (auto)
export const markAttendance = async (roll) => {
  const response = await api.post('/attendance/mark', {
    roll,
  });
  return response.data;
};

// Mark manual attendance
export const markManualAttendance = async (roll, status, timestamp = null) => {
  const payload = { roll, status };
  if (timestamp) {
    payload.timestamp = timestamp;
  }
  const response = await api.post('/attendance/manual', payload);
  return response.data;
};

// Delete student
export const deleteStudent = async (roll, adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.post('/delete_student', {
    roll,
    confirm: true,
  }, { headers });
  return response.data;
};

// Get analysis summary
export const getAnalysisSummary = async (range = 7, explain = false) => {
  const response = await api.get('/analysis/summary', {
    params: { range, explain },
  });
  return response.data;
};

// Get analysis insights
export const getAnalysisInsights = async () => {
  const response = await api.get('/analysis/insights');
  return response.data;
};

// Delete attendance record
export const deleteAttendanceRecord = async (recordId) => {
  const response = await api.delete(`/attendance/${recordId}`);
  return response.data;
};

// Delete all attendance
export const deleteAllAttendance = async () => {
  const response = await api.delete('/attendance/all');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Predictive Attendance Forecasting
export const getAttendancePrediction = async () => {
  const response = await api.get('/analysis/prediction');
  return response.data;
};

// Smart Alerts System
export const getAlerts = async (limit = 20) => {
  const response = await api.get('/alerts', { params: { limit } });
  return response.data;
};

export const clearAlerts = async (adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.post('/alerts/clear', {}, { headers });
  return response.data;
};

// Student Analytics
export const getStudentAnalytics = async (roll) => {
  const response = await api.get(`/students/${roll}/analytics`);
  return response.data;
};

// Multi-Face Recognition
export const recognizeMultipleFaces = async (imageBase64) => {
  const response = await api.post('/recognize/multi', {
    image_base64: imageBase64,
  });
  return response.data;
};

// Camera Status
export const getCameraStatus = async () => {
  const response = await api.get('/system/camera_status');
  return response.data;
};

// Database Cleanup
export const cleanupDatabase = async (adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.post('/maintenance/cleanup', {}, { headers });
  return response.data;
};

// Student ID Card
export const getStudentIdCard = async (roll) => {
  const response = await api.get(`/students/${roll}/idcard`, {
    responseType: 'blob'
  });
  return response.data;
};

// Productivity Index
export const getProductivityIndex = async () => {
  const response = await api.get('/analysis/productivity');
  return response.data;
};

// Timeline
export const getTimeline = async (limit = 50) => {
  const response = await api.get('/timeline', { params: { limit } });
  return response.data;
};

// User Role
export const getUserRole = async (adminKey = null) => {
  const headers = {};
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }
  const response = await api.get('/auth/role', { headers });
  return response.data;
};

// Bulk Upload Students
export const bulkUploadStudents = async (studentsData, adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.post('/students/bulk_upload', studentsData, { headers });
  return response.data;
};

// Bulk Edit Attendance
export const bulkEditAttendance = async (updates, adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.post('/attendance/bulk_edit', updates, { headers });
  return response.data;
};

// Attendance Clustering
export const getAttendanceClustering = async () => {
  const response = await api.get('/analysis/clustering');
  return response.data;
};

// Student Badges
export const getStudentBadges = async (roll) => {
  const response = await api.get(`/students/${roll}/badges`);
  return response.data;
};

// Update Attendance Record
export const updateAttendanceRecord = async (recordId, updates, adminKey = null) => {
  const headers = {};
  const storedKey = localStorage.getItem('adminKey');
  if (adminKey || storedKey) {
    headers['x-admin-key'] = adminKey || storedKey;
  }
  const response = await api.patch(`/attendance/${recordId}`, updates, { headers });
  return response.data;
};

// Export Attendance
export const exportAttendance = async (format = 'csv') => {
  const response = await api.get(`/attendance/export?format=${format}`, {
    responseType: 'blob'
  });
  return response.data;
};

export default api;

