# Functions in Frontend - Detailed Explanation

## API Functions (api/api.js)

### getStudents()

**What it does:**
Fetches the list of all enrolled students from the backend.

**What goes in:**
- Nothing (no parameters)

**What comes out:**
- Array of student objects, each containing: roll, name, image_paths, created_at

**Why the steps exist:**
- Makes HTTP GET request to `/students` endpoint
- Backend returns all students
- Frontend can display the list

**What happens if removed:**
- Students page would be empty
- Cannot view enrolled students
- But enrollment would still work

**Real-life analogy:**
Like calling a phone directory service to get a list of all phone numbers. This function gets a list of all students.

---

### getAttendance()

**What it does:**
Fetches all attendance records from the backend.

**What goes in:**
- Nothing (no parameters)

**What comes out:**
- Array of attendance records, each containing: id, roll, name, status, timestamp, source

**Why the steps exist:**
- Makes HTTP GET request to `/attendance` endpoint
- Backend returns all records sorted by date
- Frontend displays them in a table or list

**What happens if removed:**
- Attendance page would be empty
- Cannot view attendance history
- But marking attendance would still work

**Real-life analogy:**
Like opening an attendance register and reading all the entries. This function does it automatically from the computer.

---

### enrollStudent(name, imageBase64List)

**What it does:**
Sends student enrollment data to the backend. Registers a new student with their name and 5 face photos.

**What goes in:**
- `name` - Student's full name (string)
- `imageBase64List` - Array of 5 base64 image strings

**What comes out:**
- Success response with: status, roll number, name

**Why the steps exist:**
1. Prepares data in correct format
2. Sends POST request to `/enroll` endpoint
3. Backend processes images and saves student
4. Returns roll number to frontend
5. Frontend shows success message

**What happens if removed:**
- Cannot enroll new students
- System would be useless (no students to recognize)

**Real-life analogy:**
Like filling out a registration form and submitting it. This function sends the form data to the office (backend) for processing.

---

### recognizeFace(imageBase64)

**What it does:**
Sends a photo to the backend to identify which student it is.

**What goes in:**
- `imageBase64` - Base64 string of the captured photo

**What comes out:**
- Recognition result: status, roll, name, confidence, distance
- Or "unknown" if no match found

**Why the steps exist:**
1. Sends photo to backend
2. Backend compares with all saved faces
3. Returns best match if found
4. Frontend displays result to user

**What happens if removed:**
- Cannot recognize faces
- Scan page would be useless
- Main feature broken

**Real-life analogy:**
Like showing your ID to a security guard. They check it against their database and tell you if you're recognized. This function does that with faces.

---

### markAttendance(studentId)

**What it does:**
Marks a student as present automatically (after face recognition).

**What goes in:**
- `studentId` - The roll number of the recognized student

**What comes out:**
- Success response with attendance record

**Why the steps exist:**
1. Sends student ID to backend
2. Backend creates attendance record
3. Saves with current timestamp
4. Returns confirmation
5. Frontend shows success message

**What happens if removed:**
- Cannot mark attendance automatically
- Would need manual entry only
- Slower attendance process

**Real-life analogy:**
Like a teacher marking you present in the register after seeing you in class. This function does it automatically.

---

### markManualAttendance(roll, status, timestamp)

**What it does:**
Manually marks attendance for a student (when face recognition fails or for corrections).

**What goes in:**
- `roll` - Student roll number
- `status` - "present", "absent", or "excused"
- `timestamp` - Optional custom time (defaults to now)

**What comes out:**
- Success response with attendance record

**Why the steps exist:**
1. Allows manual entry when needed
2. Supports different statuses (present/absent/excused)
3. Can set custom timestamp (for backdating)
4. Saves to backend

**What happens if removed:**
- Cannot correct mistakes
- Cannot mark absent students
- Less flexible system

**Real-life analogy:**
Like a teacher manually writing in the attendance register when the automatic system fails. This function provides that backup option.

---

### getAnalysisSummary(range, explain)

**What it does:**
Fetches dashboard statistics: total students, today's attendance, weekly trends, etc.

**What goes in:**
- `range` - Number of days to analyze (default: 7)
- `explain` - Whether to get AI insights (default: false)

**What comes out:**
- Dictionary with all statistics:
  - total_students, present_today, attendance_rate
  - Weekly chart data
  - Recent check-ins
  - System status

**Why the steps exist:**
- Dashboard needs comprehensive statistics
- Calculates trends and patterns
- Provides visual data for charts
- Optionally includes AI insights

**What happens if removed:**
- Dashboard would be empty
- No statistics available
- Users can't see trends

**Real-life analogy:**
Like getting a report card with all your grades and attendance statistics. This function fetches that report.

---

### deleteStudent(roll, adminKey)

**What it does:**
Deletes a student from the system (moves to trash for recovery).

**What goes in:**
- `roll` - Student roll number to delete
- `adminKey` - Admin password for security

**What comes out:**
- Success response

**Why the steps exist:**
1. Checks admin permission
2. Sends delete request to backend
3. Backend moves student to trash
4. Returns confirmation
5. Frontend refreshes student list

**What happens if removed:**
- Cannot delete students
- Would need manual file editing
- No way to remove mistakes

**Real-life analogy:**
Like removing a student from the class roster. This function does it safely (with backup).

---

## Page Component Functions

### Enroll.jsx - handleCapture(imageData)

**What it does:**
Adds a captured photo to the list when user clicks "Capture" button.

**What goes in:**
- `imageData` - Base64 string of the captured photo

**What comes out:**
- Nothing (updates component state)

**Why the steps exist:**
1. Checks if already have 5 images (max limit)
2. Adds new image to the list
3. Shows success message
4. Updates progress bar

**What happens if removed:**
- Cannot collect photos for enrollment
- Enrollment would fail
- But backend enrollment function would still work

**Real-life analogy:**
Like collecting photos in an album. Each time you take a photo, you add it to the collection. This function does that digitally.

---

### Enroll.jsx - handleSubmit(e)

**What it does:**
Submits the enrollment form when user clicks "Enroll Student" button.

**What goes in:**
- `e` - Form submit event

**What comes out:**
- Nothing (shows success/error message)

**Why the steps exist:**
1. Prevents form default submission
2. Validates: must have 5 images and a name
3. Shows error if validation fails
4. Calls `enrollStudent()` API function
5. Shows success message with roll number
6. Clears form for next enrollment

**What happens if removed:**
- Cannot submit enrollment
- Form would do nothing
- Enrollment feature broken

**Real-life analogy:**
Like submitting a registration form. You check all fields are filled, then send it. This function does that validation and submission.

---

### Enroll.jsx - removeImage(index)

**What it does:**
Removes a captured photo from the list if user wants to retake it.

**What goes in:**
- `index` - Which photo to remove (0-4)

**What comes out:**
- Nothing (updates component state)

**Why the steps exist:**
1. Filters out the image at given index
2. Updates the image list
3. User can capture a new photo

**What happens if removed:**
- Cannot remove bad photos
- Would need to start over
- Less user-friendly

**Real-life analogy:**
Like removing a bad photo from an album. You take it out and can add a better one. This function does that.

---

### Dashboard.jsx - loadData()

**What it does:**
Fetches all data needed for the dashboard: statistics, insights, predictions, alerts, etc.

**What goes in:**
- Nothing (uses component state)

**What comes out:**
- Nothing (updates component state with data)

**Why the steps exist:**
1. Calls multiple API functions in parallel (Promise.all)
2. Gets: summary, insights, predictions, alerts, productivity, camera status, clustering
3. Updates component state with all data
4. Shows error if any request fails
5. Runs automatically on page load and every 30 seconds

**What happens if removed:**
- Dashboard would be empty
- No automatic updates
- Users wouldn't see statistics

**Real-life analogy:**
Like refreshing a news feed. This function automatically fetches the latest information and displays it.

---

### Scan.jsx - handleRecognize()

**What it does:**
Captures a photo and sends it for face recognition, then marks attendance if recognized.

**What goes in:**
- Nothing (uses webcam component)

**What comes out:**
- Nothing (shows recognition result)

**Why the steps exist:**
1. Gets photo from webcam
2. Calls `recognizeFace()` API
3. If recognized, calls `markAttendance()`
4. Shows success message with student name
5. Shows error if not recognized

**What happens if removed:**
- Scan page would do nothing
- Cannot recognize faces
- Main feature broken

**Real-life analogy:**
Like a security checkpoint. You show your face, they check it, and if you're recognized, you're marked as present. This function does all that automatically.

---

## Component Functions

### Toast.jsx - useToast()

**What it does:**
A React hook that provides functions to show notification messages.

**What goes in:**
- Nothing (it's a hook)

**What comes out:**
- Object with `showToast(message, type)` function

**Why the steps exist:**
- Provides easy way to show notifications
- Consistent styling and behavior
- Can be used by any component

**What happens if removed:**
- No notification messages
- Users wouldn't get feedback
- Harder to know if actions succeeded

**Real-life analogy:**
Like a notification system. You call a function, and a message appears on screen. This hook provides that functionality.

---

### WebcamCapture.jsx - handleCapture()

**What it does:**
Captures a photo from the webcam and sends it to the parent component.

**What goes in:**
- Nothing (uses webcam stream)

**What comes out:**
- Calls `onCapture` callback with base64 image

**Why the steps exist:**
1. Accesses user's webcam
2. Displays video stream
3. When user clicks capture, takes a photo
4. Converts photo to base64 format
5. Sends to parent component via callback

**What happens if removed:**
- Cannot capture photos
- Enrollment and recognition would fail
- Core feature broken

**Real-life analogy:**
Like a camera app on your phone. You open it, see yourself, click a button, and it takes a photo. This component does that in the browser.

---

## Summary

**API Functions:**
- Data fetching (getStudents, getAttendance)
- Enrollment (enrollStudent)
- Recognition (recognizeFace)
- Attendance (markAttendance, markManualAttendance)
- Analytics (getAnalysisSummary)
- Management (deleteStudent)

**Page Functions:**
- Form handling (handleSubmit, handleCapture)
- Data loading (loadData)
- User interactions (removeImage, handleRecognize)

**Component Functions:**
- UI utilities (useToast)
- Media capture (WebcamCapture)

All functions work together to create a complete user interface that communicates with the backend!

