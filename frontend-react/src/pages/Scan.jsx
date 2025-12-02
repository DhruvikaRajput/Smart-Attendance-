import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import Card from "../components/Card";
import WebcamCapture from "../components/WebcamCapture";
import { recognizeFace, markAttendance, recognizeMultipleFaces } from "../api/api";
import { useToast } from "../components/Toast";

export default function Scan() {
  const [result, setResult] = useState(null);
  const [multiResult, setMultiResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [marking, setMarking] = useState(false);
  const [multiMode, setMultiMode] = useState(false);
  const { showToast } = useToast();

  const markAndNotify = async (studentId, studentName) => {
    if (!studentId) {
      return false;
    }
    setMarking(true);
    try {
      await markAttendance(studentId);
      showToast(`Attendance marked for ${studentName || 'Student'}`, 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Failed to mark attendance', 'error');
      return false;
    } finally {
      setMarking(false);
    }
  };

  const handleScan = async (imageData) => {
    setScanning(true);
    setResult(null);
    setMultiResult(null);
    try {
      if (multiMode) {
        const data = await recognizeMultipleFaces(imageData);
        setMultiResult(data);
        if (data.status === 'ok' && data.matches?.length > 0) {
          showToast(`Recognized ${data.matches.length} face(s)`, 'success');
        } else if (data.status === 'no_faces') {
          showToast('No faces detected. Please try again.', 'warning');
        } else {
          showToast('Faces not recognized', 'error');
        }
      } else {
        const data = await recognizeFace(imageData);
        if (data.status === 'no_face') {
          setResult(data);
          showToast('No face detected. Please try again.', 'warning');
        } else if (data?.match?.student_id) {
          const marked = await markAndNotify(data.match.student_id, data.match.name);
          setResult({
            ...data,
            attendanceMarked: marked,
          });
        } else {
          setResult(data);
          showToast('Face not recognized', 'error');
        }
      }
    } catch (error) {
      console.error('Recognition error:', error);
      showToast(error.response?.data?.detail || 'Failed to recognize face', 'error');
      setResult({ status: 'error', message: 'Recognition failed' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Face Recognition Scanner</h1>
          <p className="text-text-secondary">Position your face in the frame and scan</p>
        </div>
        <button
          onClick={() => {
            setMultiMode(!multiMode);
            setResult(null);
            setMultiResult(null);
          }}
          className={`btn ${multiMode ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
        >
          <Users size={18} />
          {multiMode ? 'Multi-Face Mode' : 'Single-Face Mode'}
        </button>
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
              {scanning ? 'Processing...' : (multiResult || result) ? 'Result' : 'Ready to scan'}
            </p>
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            {multiMode && multiResult?.matches?.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-4"
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users size={32} className="text-green-600" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">
                    {multiResult.matches.length} Face(s) Recognized
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {multiResult.matches.map((match, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-background rounded-button flex items-center justify-between"
                    >
                      <div>
                    <div className="font-medium text-text-primary">{match.name}</div>
                    <div className="text-sm text-text-secondary">ID: {match.student_id || match.roll}</div>
                        <div className="text-xs text-text-tertiary">Confidence: {match.confidence}%</div>
                      </div>
                      <button
                    onClick={() => markAndNotify(match.student_id || match.roll, match.name)}
                        disabled={marking}
                        className="btn btn-success text-xs py-1.5 px-3"
                      >
                        Mark
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : multiMode && multiResult?.status === 'no_faces' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary mb-1">No Faces Detected</div>
                  <p className="text-sm text-text-secondary">{multiResult.message || 'Please ensure faces are clearly visible'}</p>
                </div>
              </motion.div>
            ) : scanning ? (
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-text-secondary">Processing face recognition...</p>
              </div>
            ) : result?.status === 'recognized' && result?.match ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary mb-1">{result.match.name}</div>
                  <div className="text-sm text-text-secondary">ID: {result.match.student_id}</div>
                  <div className="text-xs text-text-tertiary mt-2">
                    Confidence: {result.match.confidence ?? ((1 - (result.distance || 0)) * 100).toFixed(1)}%
                  </div>
                </div>
                {result.attendanceMarked === true && (
                  <div className="text-sm font-semibold text-green-600">Attendance marked automatically.</div>
                )}
                {result.attendanceMarked === false && (
                  <div className="text-sm font-semibold text-red-500">Attendance marking failed. Please try again.</div>
                )}
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

