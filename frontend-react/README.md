# Smart Attendance System - React Frontend

Apple-Premium React frontend for the Smart Attendance System.

## Features

- ✨ **Apple-Premium UI** - Clean, minimal, professional design
- ⚡ **Vite** - Lightning fast development
- 🎨 **TailwindCSS** - Utility-first styling
- 📊 **Recharts** - Beautiful charts
- 🎭 **Framer Motion** - Smooth animations
- 🔔 **Toast Notifications** - User-friendly feedback
- 📷 **Webcam Integration** - Face capture and recognition

## Installation

### 1. Navigate to frontend-react directory

```bash
cd frontend-react
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages:
- React 18
- React Router
- TailwindCSS
- Recharts
- Framer Motion
- Lucide Icons
- Axios

### 3. Start development server

```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## Prerequisites

**IMPORTANT:** Ensure the backend is running on `http://127.0.0.1:8000`

Start the backend first:
```bash
# In the project root
python backend.py
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend-react/
├── src/
│   ├── api/
│   │   └── api.js           # API client
│   ├── components/
│   │   ├── Card.jsx         # Reusable card component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── NavBar.jsx       # Top navigation bar
│   │   ├── Modal.jsx        # Modal dialog
│   │   ├── Toast.jsx        # Toast notifications
│   │   └── WebcamCapture.jsx # Webcam component
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Enroll.jsx      # Student enrollment
│   │   ├── Students.jsx    # Student management
│   │   ├── Attendance.jsx  # Attendance logs
│   │   └── Scan.jsx        # Face recognition scanner
│   ├── hooks/
│   │   ├── useStudents.js  # Students hook
│   │   ├── useAttendance.js # Attendance hook
│   │   └── useAnalysis.js   # Analysis hook
│   ├── styles/
│   │   └── global.css      # Global styles
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Pages

### Dashboard
- Real-time metrics
- Weekly attendance chart
- Department overview
- Recent check-ins
- System status

### Enroll
- Webcam capture
- 5 image capture with progress
- Student information form
- Success notifications

### Students
- List all enrolled students
- Delete with confirmation
- Smooth animations

### Attendance
- Attendance records table
- Filters (Today, Week, All)
- Manual attendance form
- Status indicators

### Scan
- Face recognition scanner
- Real-time camera preview
- Recognition results
- Mark attendance button

## API Integration

All API calls are centralized in `src/api/api.js`:

- `getStudents()` - Fetch all students
- `getAttendance()` - Fetch attendance records
- `enrollStudent(name, images)` - Enroll new student
- `recognizeFace(imageBase64)` - Recognize face
- `markAttendance(roll)` - Mark attendance
- `markManualAttendance(roll, status, timestamp)` - Manual attendance
- `deleteStudent(roll)` - Delete student
- `getAnalysisSummary(range, explain)` - Get analytics

## Styling

The app uses TailwindCSS with custom Apple-inspired theme:
- Soft grayscale palette
- Large whitespace
- Rounded corners (12-16px)
- Smooth transitions
- Clean typography

## Browser Support

- Chrome (recommended)
- Edge
- Firefox
- Safari

## Troubleshooting

### Camera not working
- Ensure browser permissions are granted
- Use HTTPS or localhost
- Check if camera is in use by another app

### API connection errors
- Verify backend is running on `http://127.0.0.1:8000`
- Check CORS settings in backend
- Verify network connectivity

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 16+)

## Development

The app uses:
- **Vite** for fast HMR (Hot Module Replacement)
- **React Router** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization

## License

Part of the Smart Attendance System project.

