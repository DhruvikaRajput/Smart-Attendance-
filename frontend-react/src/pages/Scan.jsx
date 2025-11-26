import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import WebcamCapture from '../components/WebcamCapture';
import { recognizeFace, markAttendance } from '../api/api';
import { useToast } from '../components/Toast';

export default function Scan() {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [marking, setMarking] = useState(false);
  const { showToast } = useToast();

  const handleScan = async (imageData) => {
    setScanning(true);
    setResult(null);
    try {
      const data = await recognizeFace(imageData);
      setResult(data);
      if (data.status === 'recognized') {
        showToast(`Recognized: ${data.name}`, 'success');
      } else if (data.status === 'no_face') {
        showToast('No face detected. Please try again.', 'warning');
      } else {
        showToast('Face not recognized', 'error');
      }
    } catch (error) {
      console.error('Recognition error:', error);
      showToast(error.response?.data?.detail || 'Failed to recognize face', 'error');
      setResult({ status: 'error', message: 'Recognition failed' });
    } finally {
      setScanning(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!result || result.status !== 'recognized') return;
    setMarking(true);
    try {
      await markAttendance(result.roll);
      showToast(`Attendance marked for ${result.name}`, 'success');
      setResult(null);
    } catch (error) {
      console.error('Mark attendance error:', error);
      showToast(error.response?.data?.detail || 'Failed to mark attendance', 'error');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Face Recognition Scanner</h1>
        <p className="text-text-secondary">Position your face in the frame and scan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Preview */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Camera Preview</h3>
            <p className="text-sm text-text-secondary">Position your face in the frame</p>
          </div>
          <WebcamCapture onCapture={handleScan} disabled={scanning} />
        </Card>

        {/* Recognition Result */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Recognition Result</h3>
            <p className="text-sm text-text-secondary">
              {scanning ? 'Processing...' : result ? 'Result' : 'Ready to scan'}
            </p>
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            {scanning ? (
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-text-secondary">Processing face recognition...</p>
              </div>
            ) : result?.status === 'recognized' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary mb-1">{result.name}</div>
                  <div className="text-sm text-text-secondary">Roll: {result.roll}</div>
                  <div className="text-xs text-text-tertiary mt-2">
                    Confidence: {((1 - result.distance) * 100).toFixed(1)}%
                  </div>
                </div>
                <button
                  onClick={handleMarkAttendance}
                  disabled={marking}
                  className="btn btn-success w-full"
                >
                  {marking ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Marking...
                    </>
                  ) : (
                    'Mark Attendance'
                  )}
                </button>
              </motion.div>
            ) : result?.status === 'no_face' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary mb-1">No Face Detected</div>
                  <p className="text-sm text-text-secondary">{result.message || 'Please ensure your face is clearly visible with good lighting'}</p>
                </div>
              </motion.div>
            ) : result?.status === 'unknown' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary mb-1">Not Recognized</div>
                  <p className="text-sm text-text-secondary">{result.message || 'Please ensure you are enrolled in the system'}</p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="text-5xl text-text-tertiary mb-4">👤</div>
                <p className="text-text-secondary">Click "Capture" to recognize</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

