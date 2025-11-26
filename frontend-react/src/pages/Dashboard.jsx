import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserX, TrendingUp, CheckCircle, Camera, Database, Wifi, Brain, Scan, AlertCircle, Clock, Zap, Activity, Bell } from 'lucide-react';
import Card from '../components/Card';
import { getAnalysisSummary, getAnalysisInsights, healthCheck, getAttendancePrediction, getAlerts, getProductivityIndex, getCameraStatus, getAttendanceClustering } from '../api/api';
import { useToast } from '../components/Toast';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [productivity, setProductivity] = useState(null);
  const [cameraStatus, setCameraStatus] = useState(null);
  const [clustering, setClustering] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
    checkSystemStatus();
    const interval = setInterval(() => {
      loadData();
      checkSystemStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [summary, insightsData, predictionData, alertsData, productivityData, cameraData, clusteringData] = await Promise.all([
        getAnalysisSummary(),
        getAnalysisInsights().catch(() => null),
        getAttendancePrediction().catch(() => null),
        getAlerts(10).catch(() => []),
        getProductivityIndex().catch(() => null),
        getCameraStatus().catch(() => null),
        getAttendanceClustering().catch(() => null)
      ]);
      setData(summary);
      setInsights(insightsData);
      setPrediction(predictionData);
      setAlerts(alertsData);
      setProductivity(productivityData);
      setCameraStatus(cameraData);
      setClustering(clusteringData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const health = await healthCheck();
      setSystemStatus(health);
    } catch (error) {
      setSystemStatus({ status: 'offline' });
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="h-24 bg-background animate-pulse rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Use weekly_attendance if available, fallback to old format
  const chartData = data?.weekly_attendance?.labels?.map((label, idx) => ({
    date: label,
    present: data.weekly_attendance.present_counts[idx] || 0,
    percentage: data.weekly_attendance.percentages[idx] || 0,
  })) || data?.weekly_labels?.map((label, idx) => ({
    date: label,
    present: data.weekly_present_counts[idx] || 0,
    percentage: data.daily_percentages?.[idx] || 0,
  })) || [];

  const metrics = [
    {
      label: 'Total Students',
      value: data?.total_students || 0,
      icon: Users,
      badge: 'Active',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Present Today',
      value: data?.present_today || 0,
      icon: UserCheck,
      badge: `+${data?.present_today || 0}`,
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Absent Today',
      value: data?.absent_today || 0,
      icon: UserX,
      badge: `-${data?.absent_today || 0}`,
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      label: 'Late Today',
      value: data?.late_today || 0,
      icon: Clock,
      badge: 'Late',
      badgeColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: 'Attendance Rate',
      value: `${data?.attendance_rate_today || 0}%`,
      icon: TrendingUp,
      badge: 'Today',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Productivity',
      value: `${productivity?.overall_productivity?.toFixed(1) || 0}`,
      icon: Zap,
      badge: productivity?.trend || 'stable',
      badgeColor: productivity?.trend === 'increasing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700',
    },
  ];

  const sysStatus = data?.system_status || {
    camera_status: 'offline',
    model_accuracy: 0,
    database_status: 'Unknown',
    response_time_ms: 0,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <div className="text-sm text-text-secondary uppercase tracking-wide mb-2">{metric.label}</div>
              <div className="text-4xl font-bold text-text-primary mb-3">{metric.value}</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${metric.badgeColor}`}>
                {metric.badge}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Chart */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Weekly Attendance</h3>
            <p className="text-sm text-text-secondary">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" />
              <XAxis dataKey="date" stroke="#86868b" fontSize={12} />
              <YAxis stroke="#86868b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e7',
                  borderRadius: '10px',
                }}
              />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Predictive Chart */}
        {prediction && (
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-text-primary mb-1">Predictive Forecast</h3>
              <p className="text-sm text-text-secondary">Tomorrow's prediction</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary mb-2">
                  {prediction.tomorrow_prediction}
                </div>
                <div className="text-sm text-text-secondary">
                  Expected Present ({prediction.prediction_percentage}%)
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </div>
              </div>
              {prediction.risk_groups?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm font-medium text-text-primary mb-2">Risk Groups ({prediction.risk_groups.length})</div>
                  <div className="space-y-2">
                    {prediction.risk_groups.slice(0, 3).map((risk, idx) => (
                      <div key={idx} className="text-xs text-text-secondary">
                        {risk.name} (Roll {risk.roll}): {risk.recent_rate}% attendance
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Department Bars */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Department Overview</h3>
            <p className="text-sm text-text-secondary">Attendance by department</p>
          </div>
          <div className="space-y-4">
            {data?.department_bars?.map((dept) => {
              const percentage = dept.total > 0 ? Math.round((dept.present / dept.total) * 100) : 0;
              return (
                <div key={dept.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-text-primary">{dept.name}</div>
                  <div className="flex-1 h-8 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage}%
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-text-secondary">
                    {dept.present}/{dept.total}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Check-ins */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Recent Check-ins</h3>
            <p className="text-sm text-text-secondary">Last 5 check-ins</p>
          </div>
          <div className="space-y-3">
            {data?.recent_checkins?.length > 0 ? (
              data.recent_checkins.map((checkin) => {
                const initials = checkin.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || '??';
                return (
                  <div
                    key={checkin.id}
                    className="flex items-center gap-4 p-3 rounded-button hover:bg-background transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{checkin.name || 'Unknown'}</div>
                      <div className="text-sm text-text-secondary">Roll: {checkin.roll || 'N/A'}</div>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {new Date(checkin.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-text-secondary">No recent check-ins</div>
            )}
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-text-primary mb-1">System Status</h3>
            <p className="text-sm text-text-secondary">Real-time monitoring</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: CheckCircle, label: 'Recognition Model', value: sysStatus.camera_status === 'online' ? 'Operational' : 'Offline', status: sysStatus.camera_status === 'online' ? 'success' : 'warning' },
              { icon: Camera, label: 'Camera', value: cameraStatus?.camera_available ? 'Available' : 'Unavailable', status: cameraStatus?.camera_available ? 'success' : 'warning' },
              { icon: Database, label: 'Database', value: sysStatus.database_status || 'OK', status: 'success' },
              { icon: Wifi, label: 'Response Time', value: `${sysStatus.response_time_ms || 0}ms`, status: 'success' },
              { icon: Activity, label: 'FPS', value: cameraStatus?.fps ? `${cameraStatus.fps.toFixed(1)}` : 'N/A', status: cameraStatus?.fps > 20 ? 'success' : 'warning' },
              { icon: Zap, label: 'Detection', value: cameraStatus?.detection_quality || 'Unknown', status: cameraStatus?.detection_quality === 'high' ? 'success' : 'warning' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-background rounded-button">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary">{item.label}</div>
                    <div className="text-sm font-medium text-text-primary">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {sysStatus.model_accuracy && (
            <div className="mt-4 p-3 bg-background rounded-button">
              <div className="text-xs text-text-secondary mb-1">Model Accuracy</div>
              <div className="text-sm font-medium text-text-primary">{(sysStatus.model_accuracy * 100).toFixed(1)}%</div>
            </div>
          )}
        </Card>

        {/* Alerts Panel */}
        <Card>
          <div className="mb-6 flex items-center gap-2">
            <Bell size={20} className="text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">Smart Alerts</h3>
              <p className="text-sm text-text-secondary">Recent notifications</p>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-button border-l-4 ${
                    alert.severity === 'error' ? 'bg-red-50 border-red-500' :
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="text-sm font-medium text-text-primary">{alert.message}</div>
                  <div className="text-xs text-text-secondary mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-text-secondary">No alerts</div>
            )}
          </div>
        </Card>

        {/* Productivity Meter */}
        {productivity && (
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-text-primary mb-1">Productivity Index</h3>
              <p className="text-sm text-text-secondary">Overall performance metric</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-text-primary mb-2">
                  {productivity.overall_productivity.toFixed(1)}
                </div>
                <div className="text-sm text-text-secondary">out of {productivity.max_score}</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                  productivity.trend === 'increasing' ? 'bg-green-100 text-green-700' :
                  productivity.trend === 'decreasing' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  Trend: {productivity.trend}
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${productivity.overall_productivity}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Attendance Clustering - Bubble Chart */}
        {clustering && clustering.clusters?.length > 0 && (
          <Card>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-text-primary mb-1">Performance Clusters</h3>
              <p className="text-sm text-text-secondary">KMeans analysis visualization</p>
            </div>
            <div className="space-y-4">
              {/* Cluster bars */}
              {clustering.clusters.map((cluster) => (
                <div key={cluster.name} className="p-3 bg-background rounded-button">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-text-primary capitalize">{cluster.name} Performers</div>
                    <div className="text-sm text-text-secondary">{cluster.count} students</div>
                  </div>
                  <div className="w-full bg-background-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cluster.name === 'high' ? 'bg-green-500' :
                        cluster.name === 'medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(cluster.count / (data?.total_students || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {/* Bubble chart representation */}
              <div className="mt-6 p-4 bg-background rounded-button">
                <div className="text-xs text-text-secondary mb-3 text-center">Cluster Distribution</div>
                <div className="flex items-center justify-center gap-4">
                  {clustering.clusters.map((cluster) => {
                    const size = Math.max(40, (cluster.count / (data?.total_students || 1)) * 200);
                    return (
                      <div key={cluster.name} className="flex flex-col items-center gap-2">
                        <div
                          className={`rounded-full flex items-center justify-center text-white font-bold ${
                            cluster.name === 'high' ? 'bg-green-500' :
                            cluster.name === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${size}px`, height: `${size}px` }}
                        >
                          {cluster.count}
                        </div>
                        <div className="text-xs text-text-secondary capitalize">{cluster.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* AI Insights Card */}
      {insights && (
        <Card>
          <div className="mb-6 flex items-center gap-2">
            <Brain size={24} className="text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">AI Insights</h3>
              <p className="text-sm text-text-secondary">Automated attendance analysis</p>
            </div>
          </div>
          <div className="p-4 bg-background rounded-button">
            <p className="text-text-primary leading-relaxed">{insights.insight || 'No insights available'}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
