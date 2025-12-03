# Viva Questions - Basic Level

Simple questions with easy-to-speak answers. Perfect for starting a viva or for basic understanding.

---

## Q: What does this project do?

**Answer:**
This is a Smart Attendance System that uses face recognition to automatically mark student attendance. Instead of calling names or signing papers, students just look at a camera and the system recognizes their face and marks them as present automatically.

**Simple Version:**
It's like a smart door that knows who you are by looking at your face, and automatically records that you came to class.

---

## Q: What is the backend?

**Answer:**
The backend is the server part of the system. It's written in Python and runs on the computer. It handles all the important work like recognizing faces, saving attendance records, and managing student data. The backend processes requests from the frontend and returns results.

**Simple Version:**
The backend is like the brain of the system. It does all the thinking and processing. When you send a photo, the backend looks at it, compares it with saved faces, and tells you who it is.

---

## Q: What is the frontend?

**Answer:**
The frontend is what users see and interact with. It's a website built with React that runs in the browser. Users can enroll students, view attendance, scan faces, and see statistics. The frontend sends requests to the backend and displays the results.

**Simple Version:**
The frontend is like the menu and tables in a restaurant - it's what you see and click on. It's the part that makes the system easy to use.

---

## Q: What is an API?

**Answer:**
API stands for Application Programming Interface. It's like a bridge between the frontend and backend. The frontend sends requests to the API, and the API tells the backend what to do. Then the backend sends results back through the API to the frontend.

**Simple Version:**
An API is like a waiter in a restaurant. You (frontend) tell the waiter what you want, the waiter goes to the kitchen (backend), and brings back your food (results).

---

## Q: What is a function?

**Answer:**
A function is a block of code that does a specific job. It takes some input, processes it, and returns output. For example, a function might take a photo, recognize the face, and return the student's name.

**Simple Version:**
A function is like a machine. You put something in (input), it does work, and gives you something back (output). Like a vending machine - you put in money, it gives you a snack.

---

## Q: What is face recognition?

**Answer:**
Face recognition is a technology that identifies people by analyzing their facial features. The system takes a photo, finds the face, extracts key points (like eyes, nose, mouth positions), creates a pattern of numbers, and compares it with saved patterns to find a match.

**Simple Version:**
Face recognition is like a fingerprint scanner, but for faces. It measures your face features and creates a unique code. When you come back, it compares your face code with saved codes to identify you.

---

## Q: How does the system recognize a face?

**Answer:**
First, the system takes a photo. Then it uses MediaPipe (a face detection tool) to find 468 key points on the face. These points are converted into a list of numbers called an embedding. This embedding is compared with all saved embeddings using cosine distance. If the distance is small enough (below threshold), it's a match.

**Simple Version:**
The system takes a photo, marks important points on your face (like where your eyes and nose are), creates a code from those points, and compares it with codes of known students. If the codes are similar, it knows who you are.

---

## Q: What is JSON?

**Answer:**
JSON stands for JavaScript Object Notation. It's a simple way to store and share data. It looks like a dictionary with keys and values. For example, a student might be stored as: `{"roll": "001", "name": "John Doe"}`. The system uses JSON files to store students, attendance, and face patterns.

**Simple Version:**
JSON is like a simple filing system. It stores information in a format that both humans and computers can read. Like a contact list on your phone - each person has a name and number.

---

## Q: What is React?

**Answer:**
React is a JavaScript library for building user interfaces. It makes it easy to create interactive web pages. In this project, React is used to build all the pages like Dashboard, Enroll, Students, etc. React updates the page automatically when data changes.

**Simple Version:**
React is like building blocks for websites. You create small pieces (components) and put them together to make a complete page. When something changes, React automatically updates what you see.

---

## Q: What is FastAPI?

**Answer:**
FastAPI is a Python framework for building web APIs. It makes it easy to create endpoints that the frontend can call. In this project, FastAPI handles all the backend logic - receiving requests, processing them, and returning responses.

**Simple Version:**
FastAPI is like a receptionist at an office. It receives requests, knows which department to send them to, and makes sure responses are sent back correctly.

---

## Q: What happens when you enroll a student?

**Answer:**
When enrolling a student, the system takes 5 photos of their face. Each photo is processed to extract a face pattern. These patterns are saved along with the student's name and roll number. The photos are saved to disk, and the student data is stored in students.json file. The face patterns are also saved in embeddings.json for fast recognition.

**Simple Version:**
Enrolling is like taking photos for an ID card. You take 5 photos, the system saves them, creates a face code, and gives the student a roll number. Now the system knows who they are.

---

## Q: What happens when you mark attendance?

**Answer:**
When marking attendance, the system takes a photo, recognizes the face, finds the matching student, creates an attendance record with the current timestamp, and saves it to attendance.json file. The record includes the student's roll number, name, status (present), and when they arrived.

**Simple Version:**
Marking attendance is like signing in. The system takes your photo, recognizes you, writes down that you came, and saves it. It's automatic and instant.

---

## Q: What is the difference between automatic and manual attendance?

**Answer:**
Automatic attendance uses face recognition. The system takes a photo, recognizes the student automatically, and marks them present. Manual attendance is when a teacher manually enters the attendance - they select a student and mark them as present, absent, or excused. Manual attendance is used when face recognition fails or for corrections.

**Simple Version:**
Automatic is like a self-checkout - the system does everything. Manual is like a cashier - a person enters the information. Manual is the backup when automatic doesn't work.

---

## Q: What is the dashboard?

**Answer:**
The dashboard is the main statistics page. It shows total students, how many are present today, attendance rate, weekly trends in charts, recent check-ins, and system status. It gives an overview of everything happening in the system.

**Simple Version:**
The dashboard is like a control panel. It shows you all the important numbers and charts at a glance - how many students, who came today, trends over time.

---

## Q: What files store the data?

**Answer:**
The system uses JSON files to store data:
- `students.json` - All student information (name, roll, photos)
- `attendance.json` - All attendance records
- `embeddings.json` - Face patterns for fast recognition
- `alerts.json` - System messages and warnings
- `data/faces/` folder - Student photos (images)

**Simple Version:**
Data is stored in simple text files (JSON format). Each file has a specific purpose - one for students, one for attendance, one for face codes, etc.

---

## Q: What is the threshold in face recognition?

**Answer:**
The threshold is a number that determines how similar two faces need to be to be considered a match. If the distance between face patterns is below the threshold (like 0.25), it's a match. Lower threshold means stricter matching (fewer false matches but might miss some), higher threshold means more lenient (might have false matches).

**Simple Version:**
The threshold is like how strict a security guard is. Lower number = very strict (only exact matches), higher number = more lenient (accepts similar faces). We use 0.25 which is a good balance.

---

## Q: Why do we need 5 photos during enrollment?

**Answer:**
We take 5 photos from different angles and expressions to create a better face pattern. This makes recognition more accurate because the system learns how the face looks from different views. If we only had one photo, recognition might fail if the lighting or angle is different.

**Simple Version:**
It's like taking multiple photos for an ID card. Different angles help the system recognize you even if you're looking slightly different when you come back.

---

## Tips for Speaking in Viva

1. **Start Simple:** Begin with the simple version, then add details if asked
2. **Use Analogies:** Compare technical things to everyday things (waiter, library, etc.)
3. **Be Confident:** Even if you don't know everything, explain what you do know
4. **Give Examples:** Use real examples from the project
5. **Stay Calm:** Take a breath before answering

---

## Quick Reference

- **Backend:** Python server that processes data
- **Frontend:** React website users interact with
- **API:** Bridge between frontend and backend
- **Face Recognition:** Identifying people by their face
- **JSON:** Simple data storage format
- **Enrollment:** Adding new students to the system
- **Attendance:** Recording who came to class
- **Dashboard:** Statistics and overview page

