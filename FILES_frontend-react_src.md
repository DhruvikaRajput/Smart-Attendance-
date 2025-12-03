# Files in frontend-react/src - Explanation

## App.jsx

**What it does:**
The main entry point of the React application. It sets up routing (which page to show when) and wraps everything in a layout with sidebar and navbar.

**Why it exists:**
React needs a starting point. This file tells React which pages exist and how to navigate between them. Without it, the app wouldn't know what to display.

**How it connects with other files:**
- Imports all pages from `pages/` folder
- Uses `components/Sidebar.jsx` and `components/NavBar.jsx` for layout
- Uses `components/Toast.jsx` for notifications
- Sets up routes using React Router

**What problem it solves:**
- Organizes the entire application structure
- Makes navigation between pages possible
- Provides consistent layout (sidebar + navbar) on all pages

---

## main.jsx

**What it does:**
The very first file that runs when the app starts. It renders the App component into the HTML page.

**Why it exists:**
React needs to know where to put the app on the webpage. This file connects React code to the HTML page.

**How it connects with other files:**
- Imports `App.jsx`
- Renders it into the page
- Loads `styles/global.css` for styling

**What problem it solves:**
- Starts the React application
- Connects JavaScript to HTML
- Initializes the app

---

## api/api.js

**What it does:**
Contains all functions that talk to the backend server. It's like a phone book with all the backend's phone numbers.

**Why it exists:**
Instead of writing the same code in every file, we put all API calls here. This makes the code cleaner and easier to maintain.

**How it connects with other files:**
- Used by all pages (Dashboard, Enroll, Students, etc.)
- Sends requests to `backend.py`
- Returns data that pages can use

**What problem it solves:**
- Centralizes all backend communication
- Makes it easy to change API endpoints
- Reduces code duplication
- Handles errors consistently

---

## pages/Dashboard.jsx

**What it does:**
Shows the main statistics page with charts, numbers, and insights. It's like a control center.

**Why it exists:**
Users need to see overall information quickly. This page provides a summary of everything happening in the system.

**How it connects with other files:**
- Uses `api/api.js` to get data from backend
- Uses `components/Card.jsx` to display information boxes
- Uses `components/Toast.jsx` for error messages
- Displays data from `backend.py` analysis endpoints

**What problem it solves:**
- Gives users a quick overview
- Shows trends and patterns
- Displays system status

---

## pages/Enroll.jsx

**What it does:**
Page for adding new students. Users enter name and capture 5 photos of the student's face.

**Why it exists:**
New students need to be registered before they can use the system. This page handles that process.

**How it connects with other files:**
- Uses `components/WebcamCapture.jsx` to take photos
- Uses `components/Card.jsx` for layout
- Calls `api/api.js` → `enrollStudent()` function
- Sends data to `backend.py` `/enroll` endpoint

**What problem it solves:**
- Makes enrollment easy and user-friendly
- Ensures 5 photos are captured (required for accuracy)
- Validates input before sending

---

## pages/Students.jsx

**What it does:**
Shows a list of all enrolled students. Users can view details and delete students.

**Why it exists:**
Users need to see who is registered in the system and manage the student list.

**How it connects with other files:**
- Uses `api/api.js` → `getStudents()` to fetch list
- Uses `api/api.js` → `deleteStudent()` to remove students
- Uses `components/Card.jsx` and `components/Modal.jsx` for UI
- Displays data from `backend.py` `/students` endpoint

**What problem it solves:**
- Provides student management interface
- Allows viewing all enrolled students
- Enables safe deletion (with confirmation)

---

## pages/Attendance.jsx

**What it does:**
Shows all attendance records. Users can view who came when, mark manual attendance, and delete records.

**Why it exists:**
Users need to see attendance history and sometimes mark attendance manually (if face recognition fails).

**How it connects with other files:**
- Uses `api/api.js` → `getAttendance()` to fetch records
- Uses `api/api.js` → `markManualAttendance()` for manual entry
- Uses `api/api.js` → `deleteAttendanceRecord()` to remove records
- Displays data from `backend.py` `/attendance` endpoint

**What problem it solves:**
- Shows complete attendance history
- Allows manual correction
- Provides attendance management

---

## pages/Scan.jsx

**What it does:**
The face recognition page. Users can capture a photo and the system will recognize the student and mark attendance.

**Why it exists:**
This is the main feature - automatic attendance marking using face recognition.

**How it connects with other files:**
- Uses `components/WebcamCapture.jsx` to take photos
- Uses `api/api.js` → `recognizeFace()` to identify student
- Uses `api/api.js` → `markAttendance()` to record attendance
- Sends images to `backend.py` `/recognize` endpoint

**What problem it solves:**
- Provides the core functionality (face recognition)
- Makes attendance marking fast and automatic
- Shows recognition results to user

---

## pages/StudentProfile.jsx

**What it does:**
Shows detailed information about a specific student - attendance history, analytics, badges, etc.

**Why it exists:**
Users sometimes need detailed information about one student (how many times they came, their attendance rate, etc.).

**How it connects with other files:**
- Uses `api/api.js` → `getStudentAnalytics()` for detailed stats
- Uses `api/api.js` → `getStudentBadges()` for achievements
- Displays data from `backend.py` `/students/{roll}/analytics` endpoint

**What problem it solves:**
- Provides individual student insights
- Shows attendance patterns
- Displays achievements and badges

---

## pages/Timeline.jsx

**What it does:**
Shows a chronological timeline of all events - attendance records, alerts, system messages.

**Why it exists:**
Users need to see what happened in the system over time, in order.

**How it connects with other files:**
- Uses `api/api.js` → `getTimeline()` to fetch events
- Displays data from `backend.py` `/timeline` endpoint

**What problem it solves:**
- Provides event history
- Shows system activity
- Helps with debugging and auditing

---

## components/Card.jsx

**What it does:**
A reusable box container. Used to display content in a nice bordered box.

**Why it exists:**
Many pages need boxes to show information. Instead of writing the same code everywhere, we make one component and reuse it.

**How it connects with other files:**
- Used by all pages (Dashboard, Enroll, Students, etc.)
- Provides consistent styling across the app

**What problem it solves:**
- Makes UI consistent
- Reduces code duplication
- Easy to update styling in one place

---

## components/Modal.jsx

**What it does:**
A popup window that appears on top of the page. Used for confirmations, forms, or extra information.

**Why it exists:**
Sometimes we need to show information or ask for confirmation without leaving the current page. Modals do that.

**How it connects with other files:**
- Used by Students.jsx (delete confirmation)
- Used by Attendance.jsx (manual entry form)
- Can be used by any page that needs popups

**What problem it solves:**
- Provides popup functionality
- Keeps user on same page
- Reusable across the app

---

## components/NavBar.jsx

**What it does:**
The top navigation bar. Shows the app title and sometimes user information.

**Why it exists:**
Provides consistent header across all pages. Users always know where they are.

**How it connects with other files:**
- Used by `App.jsx` (rendered on all pages)
- Provides navigation context

**What problem it solves:**
- Consistent header on all pages
- Branding and navigation

---

## components/Sidebar.jsx

**What it does:**
The left menu bar. Shows links to all pages (Dashboard, Enroll, Students, etc.).

**Why it exists:**
Users need a way to navigate between pages. The sidebar provides easy access to all features.

**How it connects with other files:**
- Used by `App.jsx` (rendered on all pages)
- Uses React Router to navigate between pages
- Links to all pages in `pages/` folder

**What problem it solves:**
- Provides navigation menu
- Makes all pages accessible
- Consistent navigation experience

---

## components/Toast.jsx

**What it does:**
Shows temporary notification messages (success, error, warning). Appears at the top or bottom of the screen and disappears after a few seconds.

**Why it exists:**
Users need feedback when actions succeed or fail. Toast messages provide that feedback without blocking the page.

**How it connects with other files:**
- Used by all pages for notifications
- Provides `useToast()` hook that pages can use
- Shows messages like "Student enrolled successfully!" or "Error: Face not recognized"

**What problem it solves:**
- Provides user feedback
- Non-intrusive notifications
- Consistent message display

---

## components/WebcamCapture.jsx

**What it does:**
A component that accesses the user's webcam and allows capturing photos. Used for enrollment and face recognition.

**Why it exists:**
Taking photos from the browser requires special code. This component handles all that complexity.

**How it connects with other files:**
- Used by `pages/Enroll.jsx` (to capture 5 photos)
- Used by `pages/Scan.jsx` (to capture face for recognition)
- Sends base64 image data to parent components

**What problem it solves:**
- Handles webcam access
- Captures photos in browser
- Converts images to base64 format (needed for API)

---

## hooks/useAnalysis.js

**What it does:**
A custom hook that fetches and manages analysis data (dashboard statistics, insights, predictions).

**Why it exists:**
Multiple components might need analysis data. This hook centralizes that logic and provides easy access.

**How it connects with other files:**
- Uses `api/api.js` to fetch data
- Can be used by any component that needs analysis
- Provides loading states and error handling

**What problem it solves:**
- Reusable data fetching logic
- Consistent error handling
- Reduces code duplication

---

## hooks/useAttendance.js

**What it does:**
A custom hook that fetches and manages attendance data.

**Why it exists:**
Similar to useAnalysis - centralizes attendance-related data fetching.

**How it connects with other files:**
- Uses `api/api.js` to fetch attendance
- Can be used by pages that need attendance data

**What problem it solves:**
- Reusable attendance data logic
- Consistent data management

---

## hooks/useStudents.js

**What it does:**
A custom hook that fetches and manages student data.

**Why it exists:**
Centralizes student-related data fetching and operations.

**How it connects with other files:**
- Uses `api/api.js` to fetch students
- Can be used by pages that need student data

**What problem it solves:**
- Reusable student data logic
- Consistent data management

---

## styles/global.css

**What it does:**
Contains global CSS styles and Tailwind CSS configuration. Defines colors, fonts, and base styles.

**Why it exists:**
Provides consistent styling across the entire application. All pages use these styles.

**How it connects with other files:**
- Imported by `main.jsx` (applied to entire app)
- Used by all components and pages
- Defines Tailwind CSS theme

**What problem it solves:**
- Consistent design across app
- Easy to change colors/fonts globally
- Centralized styling

---

## Summary

The `frontend-react/src` folder contains:

**Pages** - Different screens users see:
- Dashboard, Enroll, Students, Attendance, Scan, StudentProfile, Timeline

**Components** - Reusable UI pieces:
- Card, Modal, NavBar, Sidebar, Toast, WebcamCapture

**API** - Backend communication:
- api.js (all API functions)

**Hooks** - Reusable data logic:
- useAnalysis, useAttendance, useStudents

**Styles** - Global styling:
- global.css

**Entry Points**:
- App.jsx (main app structure)
- main.jsx (app initialization)

All these files work together to create the user interface that people interact with!

