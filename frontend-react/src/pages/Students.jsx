import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, UserPlus, Upload, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { getStudents, deleteStudent, bulkUploadStudents } from '../api/api';
import { useToast } from '../components/Toast';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
  const [bulkUploadModal, setBulkUploadModal] = useState({ open: false });
  const [bulkUploadData, setBulkUploadData] = useState('');
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      showToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.student) return;
    try {
      await deleteStudent(deleteModal.student.roll);
      showToast(`Student ${deleteModal.student.name} deleted successfully`, 'success');
      setDeleteModal({ open: false, student: null });
      loadStudents();
    } catch (error) {
      console.error('Delete error:', error);
      showToast(error.response?.data?.detail || 'Failed to delete student', 'error');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadData.trim()) {
      showToast('Please enter student data', 'error');
      return;
    }

    setUploading(true);
    try {
      // Parse JSON array or CSV-like format
      let studentsData = [];
      try {
        studentsData = JSON.parse(bulkUploadData);
      } catch {
        // Try CSV format
        const lines = bulkUploadData.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const student = {};
          headers.forEach((header, idx) => {
            student[header] = values[idx] || '';
          });
          if (student.name) {
            studentsData.push(student);
          }
        }
      }

      if (!Array.isArray(studentsData) || studentsData.length === 0) {
        showToast('Invalid data format. Expected JSON array or CSV', 'error');
        return;
      }

      const result = await bulkUploadStudents(studentsData);
      showToast(`Bulk upload completed: ${result.enrolled?.length || 0} enrolled, ${result.errors?.length || 0} errors`, 'success');
      setBulkUploadModal({ open: false });
      setBulkUploadData('');
      loadStudents();
    } catch (error) {
      console.error('Bulk upload error:', error);
      showToast(error.response?.data?.detail || 'Failed to bulk upload students', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Try to parse as JSON
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          setBulkUploadData(JSON.stringify(data, null, 2));
        } else {
          showToast('File must contain a JSON array', 'error');
        }
      } catch {
        // If not JSON, treat as text
        setBulkUploadData(event.target.result);
      }
    };
    reader.readAsText(file);
  };

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Students</h1>
          <p className="text-text-secondary">Manage enrolled students</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBulkUploadModal({ open: true })}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            Bulk Upload
          </button>
          <Link to="/enroll" className="btn btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            Enroll New
          </Link>
        </div>
      </div>

      <Card>
        {students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No students enrolled yet</p>
            <Link to="/enroll" className="btn btn-primary inline-flex items-center gap-2">
              <UserPlus size={18} />
              Enroll First Student
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Roll Number
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Enrolled
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const initials = student.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || '??';
                  return (
                    <motion.tr
                      key={student.roll}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-background transition-colors"
                    >
                      <td className="py-4 px-4">
                        <Link to={`/students/${student.roll}`} className="flex items-center gap-3 hover:opacity-80">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {initials}
                          </div>
                          <div className="font-medium text-text-primary">{student.name}</div>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm font-mono font-semibold text-text-primary">{student.roll}</code>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-secondary">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setDeleteModal({ open: true, student })}
                          className="btn btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, student: null })}
        title="Delete Student"
      >
        {deleteModal.student && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete <strong>{deleteModal.student.name}</strong> (Roll:{' '}
              <strong>{deleteModal.student.roll}</strong>)? This action will move the student to trash and can be
              recovered later.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ open: false, student: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={bulkUploadModal.open}
        onClose={() => {
          setBulkUploadModal({ open: false });
          setBulkUploadData('');
        }}
        title="Bulk Upload Students"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Upload JSON or CSV File
            </label>
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleFileUpload}
              className="input"
            />
            <p className="text-xs text-text-secondary mt-1">
              JSON format: [{"{"}"name": "John Doe", "roll": "001"{"}"}]
            </p>
            <p className="text-xs text-text-secondary">
              CSV format: name,roll (one per line)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Or paste data directly
            </label>
            <textarea
              value={bulkUploadData}
              onChange={(e) => setBulkUploadData(e.target.value)}
              className="input min-h-[200px] font-mono text-sm"
              placeholder='[{"name": "John Doe", "roll": "001"}, {"name": "Jane Smith", "roll": "002"}]'
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setBulkUploadModal({ open: false });
                setBulkUploadData('');
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpload}
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

