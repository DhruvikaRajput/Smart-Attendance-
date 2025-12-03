# Backend Request Flow - How It Works

## Overview

This document explains how a request travels through the system, from when a user clicks a button to when they see the result. Think of it like explaining how a letter gets delivered - from writing it to receiving a reply.

## Simple Example: Marking Attendance

Let's follow one complete request from start to finish:

**User Action:** Student looks at camera, system recognizes face, marks attendance.

---

## Step-by-Step Flow

### Step 1: User Action (Frontend)

```
User clicks "Capture & Recognize" button on Scan page
```

**What happens:**
- User is on the Scan page
- Webcam is showing their face
- User clicks the button

**Where:** `frontend-react/src/pages/Scan.jsx`

---

### Step 2: Capture Photo (Frontend)

```
WebcamCapture component takes a photo
```

**What happens:**
1. `WebcamCapture.jsx` component accesses the webcam
2. Takes a snapshot of the video stream
3. Converts photo to base64 string (text format)
4. Sends base64 string to parent component

**Where:** `frontend-react/src/components/WebcamCapture.jsx`

**Result:** Base64 image string ready to send

---

### Step 3: Send Request (Frontend API)

```
recognizeFace(imageBase64) function is called
```

**What happens:**
1. `Scan.jsx` calls `recognizeFace()` from `api/api.js`
2. Function prepares HTTP POST request
3. Request includes:
   - URL: `http://127.0.0.1:8000/recognize`
   - Method: POST
   - Body: `{ "image_base64": "data:image/jpeg;base64,..." }`
   - Headers: `Content-Type: application/json`

**Where:** `frontend-react/src/api/api.js`

**Result:** HTTP request sent to backend

---

### Step 4: Request Arrives (Backend)

```
FastAPI receives the request at /recognize endpoint
```

**What happens:**
1. Request arrives at backend server (port 8000)
2. FastAPI framework receives it
3. FastAPI checks: "Is there a function for `/recognize`?"
4. Finds `recognize_face()` function
5. Validates request format (checks for `image_base64` field)
6. If invalid, returns error immediately
7. If valid, calls the function

**Where:** `backend.py` - FastAPI routing

**Result:** Request validated and routed to correct function

---

### Step 5: Process Request (Backend Function)

```
recognize_face(request) function executes
```

**What happens:**
1. Function receives request object
2. Extracts `image_base64` from request body
3. Calls `embed_image()` to process the photo:
   - Decodes base64 to image
   - Extracts face pattern using MediaPipe
4. Loads all saved face patterns from `embeddings.json`
5. Compares new pattern with all saved patterns:
   - Uses `cosine_distance()` for each comparison
   - Finds the best match (lowest distance)
6. Checks if match is good enough (distance < threshold)
7. If match found:
   - Returns student info (roll, name, confidence)
8. If no match:
   - Returns "unknown" message

**Where:** `backend.py` - `recognize_face()` function

**Result:** Recognition result (student info or "unknown")

---

### Step 6: Read Data (Backend Storage)

```
atomic_read_json() reads embeddings.json
```

**What happens:**
1. Function opens `data/embeddings.json` file
2. Reads JSON data (all student face patterns)
3. If file is corrupted, tries again (up to 3 times)
4. If still corrupted, creates backup and new file
5. Returns data as Python dictionary

**Where:** `backend.py` - `atomic_read_json()` helper function

**Result:** All saved face patterns loaded into memory

---

### Step 7: Compare Faces (Backend Processing)

```
cosine_distance() compares face patterns
```

**What happens:**
1. Takes new face pattern (from photo)
2. Takes saved face pattern (from database)
3. Calculates mathematical similarity
4. Returns distance number (0 = identical, 1 = completely different)
5. Repeats for all saved faces
6. Finds the one with lowest distance

**Where:** `backend.py` - `cosine_distance()` helper function

**Result:** Best matching student identified

---

### Step 8: Return Response (Backend)

```
Function returns JSON response
```

**What happens:**
1. Function creates response dictionary:
   ```json
   {
     "status": "recognized",
     "roll": "001",
     "name": "John Doe",
     "confidence": 95.5,
     "distance": 0.045
   }
   ```
2. FastAPI converts dictionary to JSON
3. Sends HTTP response:
   - Status code: 200 (success)
   - Body: JSON data
   - Headers: Content-Type: application/json

**Where:** `backend.py` - `recognize_face()` return statement

**Result:** HTTP response sent back to frontend

---

### Step 9: Receive Response (Frontend)

```
axios receives the HTTP response
```

**What happens:**
1. `axios` library receives response
2. Extracts JSON data from response body
3. Returns data to `recognizeFace()` function
4. Function returns data to `Scan.jsx` component

**Where:** `frontend-react/src/api/api.js`

**Result:** Recognition result available in component

---

### Step 10: Mark Attendance (If Recognized)

```
markAttendance(studentId) is called automatically
```

**What happens:**
1. If recognition succeeded, `Scan.jsx` calls `markAttendance()`
2. Sends POST request to `/attendance/mark`
3. Backend receives request
4. Backend function:
   - Validates student exists
   - Creates attendance record
   - Saves to `attendance.json`
   - Returns success message
5. Frontend shows success notification

**Where:** `frontend-react/src/pages/Scan.jsx` and `backend.py` - `mark_attendance()`

**Result:** Attendance marked successfully

---

### Step 11: Display Result (Frontend UI)

```
Component updates UI with result
```

**What happens:**
1. `Scan.jsx` receives recognition result
2. Updates component state
3. React re-renders the page
4. Shows:
   - Student name and roll number
   - Confidence percentage
   - Success message
   - "Attendance Marked" notification

**Where:** `frontend-react/src/pages/Scan.jsx`

**Result:** User sees the result on screen

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│  User clicks "Capture & Recognize" button                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: Scan.jsx                              │
│  1. handleRecognize() called                                 │
│  2. Gets photo from WebcamCapture                            │
│  3. Calls recognizeFace(imageBase64)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           FRONTEND: api/api.js                                │
│  recognizeFace() function:                                   │
│  - Prepares HTTP POST request                                │
│  - URL: http://127.0.0.1:8000/recognize                     │
│  - Body: { image_base64: "..." }                            │
│  - Sends request via axios                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST Request
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND: FastAPI Router                         │
│  1. Receives request at /recognize endpoint                 │
│  2. Validates request format                                 │
│  3. Routes to recognize_face() function                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         BACKEND: recognize_face() function                  │
│  1. Extracts image_base64 from request                       │
│  2. Calls embed_image() to process photo                    │
│  3. Loads embeddings from embeddings.json                   │
│  4. Compares face patterns                                   │
│  5. Finds best match                                         │
│  6. Returns result                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Read File
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         BACKEND: atomic_read_json()                          │
│  1. Opens data/embeddings.json                               │
│  2. Reads JSON data                                          │
│  3. Returns Python dictionary                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Return Data
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         BACKEND: recognize_face() (continued)               │
│  1. Compares patterns using cosine_distance()                │
│  2. Finds best match                                         │
│  3. Creates response: { status, roll, name, confidence }    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Response (JSON)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           FRONTEND: api/api.js                                │
│  axios receives response                                     │
│  Returns data to Scan.jsx                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: Scan.jsx                               │
│  1. Receives recognition result                              │
│  2. If recognized, calls markAttendance()                   │
│  3. Updates UI with result                                   │
│  4. Shows success message                                    │
└─────────────────────────────────────────────────────────────┘
```

## Request Types

### 1. GET Request (Reading Data)

**Example:** Getting list of students

```
Frontend → GET /students → Backend reads students.json → Returns list
```

**Flow:**
1. Frontend calls `getStudents()`
2. Sends GET request to `/students`
3. Backend reads `students.json`
4. Returns list of students
5. Frontend displays list

---

### 2. POST Request (Creating/Sending Data)

**Example:** Enrolling a student

```
Frontend → POST /enroll {name, images} → Backend processes → Saves to files → Returns roll number
```

**Flow:**
1. Frontend calls `enrollStudent(name, images)`
2. Sends POST request with student data
3. Backend processes images (extracts face patterns)
4. Saves to `students.json` and `embeddings.json`
5. Saves images to `data/faces/` folder
6. Returns roll number
7. Frontend shows success message

---

### 3. DELETE Request (Removing Data)

**Example:** Deleting a student

```
Frontend → DELETE /delete_student {roll} → Backend moves to trash → Returns success
```

**Flow:**
1. Frontend calls `deleteStudent(roll)`
2. Sends POST request (with admin key)
3. Backend validates admin permission
4. Moves student data to trash folder
5. Removes from `students.json` and `embeddings.json`
6. Returns success
7. Frontend refreshes student list

---

## Error Handling Flow

### What Happens When Something Goes Wrong?

**Example:** Face not recognized

```
1. Request sent to /recognize
2. Backend processes photo
3. No face detected OR no match found
4. Backend returns: { "status": "unknown", "message": "..." }
5. Frontend receives error response
6. Shows error message to user: "Face not recognized"
```

**Example:** Backend server is down

```
1. Frontend sends request
2. No response received (connection error)
3. axios throws error
4. Frontend catches error
5. Shows error message: "Cannot connect to server"
```

**Example:** Invalid data sent

```
1. Frontend sends malformed request
2. Backend validates request
3. Validation fails
4. Backend returns: HTTP 400 (Bad Request)
5. Frontend receives error
6. Shows error message to user
```

---

## Security Checks

### Permission Checking

**Example:** Deleting a student requires admin key

```
1. Frontend sends delete request with admin key
2. Backend checks: check_permission("delete", adminKey)
3. If key matches → Allow deletion
4. If key doesn't match → Return HTTP 403 (Forbidden)
5. Frontend shows error: "Insufficient permissions"
```

---

## Data Flow Summary

**Simple Request:**
```
User Action → Frontend Function → API Call → HTTP Request → 
Backend Function → Process Data → Read/Write Files → 
Return Response → HTTP Response → Frontend Receives → 
Update UI → User Sees Result
```

**Key Points:**
- Frontend handles user interaction
- API layer handles communication
- Backend handles processing and storage
- Files store persistent data
- Everything flows in one direction (request → response)

---

## Real-Life Analogy

Think of it like ordering food:

1. **User Action** - You decide what to order (click button)
2. **Frontend** - You write your order on a form (prepare request)
3. **API Call** - You give the form to the waiter (send HTTP request)
4. **Backend Router** - Waiter takes it to the kitchen (FastAPI routes)
5. **Backend Function** - Chef reads the order (function processes)
6. **Storage** - Chef checks ingredients (reads JSON files)
7. **Processing** - Chef prepares the food (face recognition)
8. **Response** - Waiter brings food back (HTTP response)
9. **Frontend** - You receive your food (get data)
10. **Display** - You see what you got (update UI)

That's exactly how the system works - just with data instead of food!

