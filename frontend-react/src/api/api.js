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
export const deleteStudent = async (roll, adminKey = 'changeme') => {
  const response = await api.post('/delete_student', {
    roll,
    confirm: true,
  }, {
    headers: {
      'x-admin-key': adminKey,
    },
  });
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

export default api;

