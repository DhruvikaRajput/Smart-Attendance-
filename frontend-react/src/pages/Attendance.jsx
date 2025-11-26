import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Download, FileSpreadsheet, CheckSquare, Square, Upload } from 'lucide-react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getAttendance, markManualAttendance, getStudents, deleteAttendanceRecord, deleteAllAttendance, updateAttendanceRecord, exportAttendance, bulkEditAttendance } from '../api/api';
import { useToast } from '../components/Toast';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ roll: '', status: 'present', timestamp: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null, type: 'single' });
  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [bulkActionModal, setBulkActionModal] = useState({ open: false, action: null });
  const [bulkEditData, setBulkEditData] = useState('');
  const [bulkEditing, setBulkEditing] = useState(false);
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
      setSelectedRecords(new Set());
      loadAttendance();
    } catch (error) {
      console.error('Delete error:', error);
      showToast(error.response?.data?.detail || 'Failed to delete attendance', 'error');
    }
  };

  const handleEdit = async (updates) => {
    if (!editModal.record) return;
    try {
      await updateAttendanceRecord(editModal.record.id, updates);
      showToast('Attendance record updated', 'success');
      setEditModal({ open: false, record: null });
      loadAttendance();
    } catch (error) {
      console.error('Update error:', error);
      showToast(error.response?.data?.detail || 'Failed to update attendance', 'error');
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = await exportAttendance(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast(`Exported to ${format.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to export attendance', 'error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRecords.size === 0) {
      showToast('Please select records first', 'warning');
      return;
    }

    try {
      if (action === 'delete') {
        const updates = Array.from(selectedRecords).map(id => ({ id, _action: 'delete' }));
        // Delete each selected record
        for (const id of selectedRecords) {
          await deleteAttendanceRecord(id);
        }
        showToast(`${selectedRecords.size} records deleted`, 'success');
      } else if (action === 'edit') {
        // Prepare bulk edit data from selected records
        const selectedRecordsData = filteredAttendance.filter(r => selectedRecords.has(r.id));
        const editData = selectedRecordsData.map(r => ({
          id: r.id,
          status: r.status,
          timestamp: r.timestamp
        }));
        setBulkEditData(JSON.stringify(editData, null, 2));
        setBulkActionModal({ open: true, action: 'edit' });
        return;
      }
      setSelectedRecords(new Set());
      loadAttendance();
    } catch (error) {
      console.error('Bulk action error:', error);
      showToast('Failed to perform bulk action', 'error');
    }
  };

  const toggleSelectRecord = (recordId) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRecords.size === filteredAttendance.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredAttendance.map(r => r.id)));
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
        <div className="flex items-center gap-3">
          {attendance.length > 0 && (
            <>
              <button
                onClick={() => handleExport('csv')}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="btn btn-secondary flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
              {selectedRecords.size > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction('edit')}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Bulk Edit ({selectedRecords.size})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="btn btn-danger flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete Selected ({selectedRecords.size})
                  </button>
                </>
              )}
              <button
                onClick={() => setDeleteModal({ open: true, record: null, type: 'all' })}
                className="btn btn-danger flex items-center gap-2"
              >
                <Trash2 size={18} />
                Clear All
              </button>
            </>
          )}
        </div>
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
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 hover:text-text-primary"
                  >
                    {selectedRecords.size === filteredAttendance.length && filteredAttendance.length > 0 ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
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
                      className={`border-b border-border hover:bg-background transition-colors ${
                        selectedRecords.has(record.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleSelectRecord(record.id)}
                          className="hover:text-text-primary"
                        >
                          {selectedRecords.has(record.id) ? (
                            <CheckSquare size={18} className="text-blue-600" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditModal({ open: true, record })}
                            className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, record, type: 'single' })}
                            className="btn btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
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

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, record: null })}
        title="Edit Attendance Record"
      >
        {editModal.record && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <select
                id="edit-status"
                defaultValue={editModal.record.status}
                className="input"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Timestamp</label>
              <input
                type="datetime-local"
                id="edit-timestamp"
                defaultValue={editModal.record.timestamp ? new Date(editModal.record.timestamp).toISOString().slice(0, 16) : ''}
                className="input"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditModal({ open: false, record: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const status = document.getElementById('edit-status').value;
                  const timestamp = document.getElementById('edit-timestamp').value;
                  handleEdit({ status, timestamp: timestamp ? new Date(timestamp).toISOString() : editModal.record.timestamp });
                }}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal
        isOpen={bulkActionModal.open && bulkActionModal.action === 'edit'}
        onClose={() => {
          setBulkActionModal({ open: false, action: null });
          setBulkEditData('');
        }}
        title="Bulk Edit Attendance"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Edit Data (JSON format)
            </label>
            <textarea
              value={bulkEditData}
              onChange={(e) => setBulkEditData(e.target.value)}
              className="input min-h-[200px] font-mono text-sm"
              placeholder='[{"id": "record_id", "status": "present", "timestamp": "2024-01-01T10:00:00"}]'
            />
            <p className="text-xs text-text-secondary mt-1">
              Modify status and/or timestamp for selected records
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setBulkActionModal({ open: false, action: null });
                setBulkEditData('');
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const updates = JSON.parse(bulkEditData);
                  if (!Array.isArray(updates)) {
                    showToast('Invalid format. Expected JSON array', 'error');
                    return;
                  }
                  setBulkEditing(true);
                  await bulkEditAttendance(updates);
                  showToast(`${updates.length} records updated`, 'success');
                  setBulkActionModal({ open: false, action: null });
                  setBulkEditData('');
                  setSelectedRecords(new Set());
                  loadAttendance();
                } catch (error) {
                  console.error('Bulk edit error:', error);
                  showToast(error.response?.data?.detail || 'Failed to bulk edit', 'error');
                } finally {
                  setBulkEditing(false);
                }
              }}
              disabled={bulkEditing}
              className="btn btn-primary"
            >
              {bulkEditing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
