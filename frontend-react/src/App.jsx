import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Enroll from './pages/Enroll';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Scan from './pages/Scan';
import StudentProfile from './pages/StudentProfile';
import Timeline from './pages/Timeline';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <NavBar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:roll" element={<StudentProfile />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/timeline" element={<Timeline />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;

