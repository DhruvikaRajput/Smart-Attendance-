import { useState, useEffect } from 'react';
import { Shield, User } from 'lucide-react';
import { getUserRole } from '../api/api';

export default function NavBar() {
  const [userRole, setUserRole] = useState({ role: 'admin', permissions: [] });
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');

  useEffect(() => {
    loadUserRole();
  }, [adminKey]);

  const loadUserRole = async () => {
    try {
      const role = await getUserRole(adminKey || null);
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
    }
  };

  const handleRoleToggle = () => {
    const newKey = adminKey ? '' : prompt('Enter Admin Key (leave empty for TA mode):') || '';
    setAdminKey(newKey);
    if (newKey) {
      localStorage.setItem('adminKey', newKey);
    } else {
      localStorage.removeItem('adminKey');
    }
    loadUserRole();
  };

  return (
    <nav className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Smart Attendance System</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-text-secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button
            onClick={handleRoleToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-button text-sm ${
              userRole.role === 'admin'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
            title={userRole.role === 'admin' ? 'Admin Mode' : 'TA Mode'}
          >
            {userRole.role === 'admin' ? (
              <>
                <Shield size={16} />
                Admin
              </>
            ) : (
              <>
                <User size={16} />
                TA
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

