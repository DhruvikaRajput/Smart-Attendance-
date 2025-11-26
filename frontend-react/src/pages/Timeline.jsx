import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, UserCheck, UserX, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import Card from '../components/Card';
import { getTimeline } from '../api/api';
import { useToast } from '../components/Toast';

export default function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    loadTimeline();
  }, [filter]);

  const loadTimeline = async () => {
    try {
      const data = await getTimeline(100);
      setTimeline(data);
    } catch (error) {
      console.error('Error loading timeline:', error);
      showToast('Failed to load timeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'attendance':
        return UserCheck;
      case 'alert':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getEventColor = (type, data) => {
    if (type === 'alert') {
      switch (data?.severity) {
        case 'error':
          return 'text-red-600 bg-red-50 border-red-200';
        case 'warning':
          return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        default:
          return 'text-blue-600 bg-blue-50 border-blue-200';
      }
    }
    if (type === 'attendance') {
      switch (data?.status) {
        case 'present':
          return 'text-green-600 bg-green-50 border-green-200';
        case 'absent':
          return 'text-red-600 bg-red-50 border-red-200';
        case 'excused':
          return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        default:
          return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filteredTimeline = timeline.filter((event) => {
    if (filter === 'attendance') {
      return event.type === 'attendance';
    } else if (filter === 'alerts') {
      return event.type === 'alert';
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Timeline</h1>
          <p className="text-text-secondary">Chronological view of all events</p>
        </div>
        <div className="flex items-center gap-3">
          {['all', 'attendance', 'alerts'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} capitalize`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-text-primary mb-1">Event Timeline</h3>
          <p className="text-sm text-text-secondary">{filteredTimeline.length} event(s)</p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {filteredTimeline.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">No events found</div>
            ) : (
              filteredTimeline.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type, event.data);
                
                return (
                  <motion.div
                    key={event.timestamp + index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="relative flex items-start gap-4"
                  >
                    {/* Timeline dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 ${colorClass}`}>
                      <Icon size={20} />
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 pb-6">
                      <div className={`p-4 rounded-button border-l-4 ${colorClass}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-text-primary capitalize">
                            {event.type === 'attendance' 
                              ? `${event.data?.name || 'Unknown'} - ${event.data?.status || 'unknown'}`
                              : event.data?.alert_type?.replace(/_/g, ' ') || 'Alert'}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        {event.type === 'attendance' && (
                          <div className="space-y-1 text-sm">
                            <div className="text-text-secondary">
                              Roll: <code className="font-mono">{event.data?.roll || 'N/A'}</code>
                            </div>
                            <div className="text-text-secondary">
                              Source: <span className="font-medium">{event.data?.source || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                        
                        {event.type === 'alert' && (
                          <div className="text-sm text-text-secondary">
                            {event.data?.message || 'No message'}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

