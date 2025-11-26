import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Enroll from './pages/Enroll';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Scan from './pages/Scan';

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
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/scan" element={<Scan />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;

