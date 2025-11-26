import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getAttendance, markManualAttendance, getStudents, deleteAttendanceRecord, deleteAllAttendance } from '../api/api';
import { useToast } from '../components/Toast';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ roll: '', status: 'present', timestamp: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null, type: 'single' });
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [filter]);

  const loadData = async () => {
    try {
      const [attendanceData, studentsData] = await Promise.all([getAttendance(), getStudents()]);
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      const data = await getAttendance();
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
      showToast('Failed to load attendance', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roll.trim()) {
      showToast('Please enter roll number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await markManualAttendance(
        formData.roll.trim(),
        formData.status,
        formData.timestamp || null
      );
      showToast(`Attendance marked: ${formData.status}`, 'success');
      setFormData({ roll: '', status: 'present', timestamp: '' });
      loadAttendance();
    } catch (error) {
      console.error('Manual attendance error:', error);
      showToast(error.response?.data?.detail || 'Failed to mark attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.record) return;

    try {
      if (deleteModal.type === 'all') {
        await deleteAllAttendance();
        showToast('All attendance records deleted', 'success');
      } else {
        await deleteAttendanceRecord(deleteModal.record.id);
        showToast('Attendance record deleted', 'success');
      }
      setDeleteModal({ open: false, record: null, type: 'single' });
      loadAttendance();
    } catch (error) {
      console.error('Delete error:', error);
      showToast(error.response?.data?.detail || 'Failed to delete attendance', 'error');
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return record.timestamp?.startsWith(today);
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(record.timestamp) >= weekAgo;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-8">
        <Card>
          <div className="h-64 bg-background animate-pulse rounded" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Attendance</h1>
          <p className="text-text-secondary">View and manage attendance records</p>
        </div>
        {attendance.length > 0 && (
          <button
            onClick={() => setDeleteModal({ open: true, record: null, type: 'all' })}
            className="btn btn-danger flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear All Attendance
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manual Attendance Form */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Manual Attendance</h3>
            <p className="text-sm text-text-secondary">Mark attendance manually</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Roll Number</label>
              <input
                type="text"
                value={formData.roll}
                onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                className="input"
                placeholder="Enter roll number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date & Time (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                className="input"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary w-full">
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Marking...
                </>
              ) : (
                'Mark Attendance'
              )}
            </button>
          </form>
        </Card>

        {/* Filters */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Filters</h3>
            <p className="text-sm text-text-secondary">Filter attendance records</p>
          </div>
          <div className="space-y-3">
            {[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'all', label: 'All Records' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`w-full btn ${
                  filter === f.value ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-text-primary mb-1">Attendance Records</h3>
          <p className="text-sm text-text-secondary">{filteredAttendance.length} record(s)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Student
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Roll
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Source
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Timestamp
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record, index) => {
                  const initials = record.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || '??';
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-background transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {initials}
                          </div>
                          <div className="font-medium text-text-primary">{record.name || 'Unknown'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm font-mono font-semibold text-text-primary">{record.roll || 'N/A'}</code>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`status-chip ${record.status}`}>{record.status || 'unknown'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.source === 'auto'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {record.source?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-secondary">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setDeleteModal({ open: true, record, type: 'single' })}
                          className="btn btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, record: null, type: 'single' })}
        title={deleteModal.type === 'all' ? 'Delete All Attendance' : 'Delete Attendance Record'}
      >
        <div className="space-y-4">
          {deleteModal.type === 'all' ? (
            <p className="text-text-secondary">
              Are you sure you want to delete <strong>all attendance records</strong>? This action cannot be undone.
            </p>
          ) : (
            <p className="text-text-secondary">
              Are you sure you want to delete the attendance record for <strong>{deleteModal.record?.name}</strong> (Roll: <strong>{deleteModal.record?.roll}</strong>)?
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteModal({ open: false, record: null, type: 'single' })}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
