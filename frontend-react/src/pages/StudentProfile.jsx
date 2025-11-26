import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Award, TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import Card from '../components/Card';
import { getStudentAnalytics, getStudentBadges, getStudentIdCard, getStudents } from '../api/api';
import { useToast } from '../components/Toast';

export default function StudentProfile() {
  const { roll } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [badges, setBadges] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [roll]);

  const loadData = async () => {
    try {
      const [analyticsData, badgesData, studentsData] = await Promise.all([
        getStudentAnalytics(roll).catch(() => null),
        getStudentBadges(roll).catch(() => null),
        getStudents().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setBadges(badgesData);
      setStudent(studentsData.find(s => s.roll === roll));
    } catch (error) {
      console.error('Error loading student profile:', error);
      showToast('Failed to load student profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIdCard = async () => {
    try {
      const blob = await getStudentIdCard(roll);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idcard_${roll}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('ID card downloaded', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download ID card', 'error');
    }
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

  if (!student) {
    return (
      <div className="p-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">Student not found</p>
            <Link to="/students" className="btn btn-primary">
              Back to Students
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare heatmap data
  const heatmapData = analytics?.heatmap || [];
  const heatmapMatrix = [];
  for (let i = 0; i < 5; i++) {
    heatmapMatrix.push([]);
    for (let j = 0; j < 6; j++) {
      const idx = i * 6 + j;
      if (idx < heatmapData.length) {
        heatmapMatrix[i].push(heatmapData[heatmapData.length - 1 - idx]);
      }
    }
  }

  const getHeatmapColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'excused': return 'bg-yellow-500';
      default: return 'bg-gray-200';
    }
  };

  const photoUrl = student?.image_paths?.[0] 
    ? `http://127.0.0.1:8000/students/${roll}/photo` 
    : null;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/students" className="btn btn-secondary">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt={student.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{student.name}</h1>
              <p className="text-text-secondary">Roll: {roll}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDownloadIdCard}
          className="btn btn-primary flex items-center gap-2"
        >
          <Download size={18} />
          Download ID Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Reliability Score</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-text-primary mb-2">
              {analytics?.reliability_score?.toFixed(1) || 0}
            </div>
            <div className="text-sm text-text-secondary">out of 100</div>
            <div className="w-full bg-background rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics?.reliability_score || 0}%` }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Current Streak</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-text-primary mb-2">
              {analytics?.current_streak || 0}
            </div>
            <div className="text-sm text-text-secondary">days</div>
            <div className="text-xs text-text-tertiary mt-2">
              Longest: {analytics?.longest_streak || 0} days
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Attendance Rate</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-text-primary mb-2">
              {analytics?.attendance_rate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-text-secondary">
              {analytics?.total_present || 0} present / {analytics?.total_present + analytics?.total_absent || 0} total
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heatmap */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Attendance Heatmap</h3>
            <p className="text-sm text-text-secondary">Last 30 days</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Present</span>
              <div className="w-4 h-4 bg-red-500 rounded ml-4" />
              <span>Absent</span>
              <div className="w-4 h-4 bg-yellow-500 rounded ml-4" />
              <span>Excused</span>
              <div className="w-4 h-4 bg-gray-200 rounded ml-4" />
              <span>No Data</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {heatmapMatrix.map((row, i) => (
                row.map((day, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`aspect-square rounded ${getHeatmapColor(day?.status)}`}
                    title={`${day?.date || ''} - ${day?.status || 'none'}`}
                  />
                ))
              ))}
            </div>
          </div>
        </Card>

        {/* Punctuality Chart */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Punctuality</h3>
            <p className="text-sm text-text-secondary">Arrival times</p>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics?.punctuality_chart?.length > 0 ? (
              analytics.punctuality_chart.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-button">
                  <div className="text-sm text-text-primary">{entry.date}</div>
                  <div className="text-sm font-medium text-text-primary">{entry.time}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">No punctuality data</div>
            )}
          </div>
        </Card>
      </div>

      {/* Badges */}
      {badges && badges.badges?.length > 0 && (
        <Card>
          <div className="mb-6 flex items-center gap-2">
            <Award size={24} className="text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">Badges</h3>
              <p className="text-sm text-text-secondary">{badges.total_badges} badges earned</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.badges.map((badge, idx) => (
              <div
                key={idx}
                className="p-4 bg-background rounded-button border-2 border-purple-200"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold text-text-primary mb-1">{badge.name}</div>
                <div className="text-xs text-text-secondary">{badge.description}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Leave Detection */}
      {analytics?.leave_detection && analytics.leave_detection.type !== 'normal' && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Leave Detection</h3>
          </div>
          <div className={`p-4 rounded-button ${
            analytics.leave_detection.type === 'likely_sick_leave' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
            analytics.leave_detection.type === 'travel_leave' ? 'bg-blue-50 border-l-4 border-blue-500' :
            'bg-red-50 border-l-4 border-red-500'
          }`}>
            <div className="text-sm font-medium text-text-primary capitalize mb-1">
              {analytics.leave_detection.type.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-text-secondary">
              Confidence: {(analytics.leave_detection.confidence * 100).toFixed(0)}%
              {analytics.leave_detection.days && ` • ${analytics.leave_detection.days} days`}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

