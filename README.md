# Smart Attendance System

A premium Smart Attendance System with face recognition using FaceNet PyTorch.

## Features

- ✨ **Premium UI** - Clean, minimal, professional interface
- 👤 **Face Recognition** - face recognition using facenet-pytorch
- 📸 **Student Enrollment** - Capture 5 photos per student for accurate recognition
- 🗑️ **Safe Deletion** - Deleted students moved to trash for recovery
- ✅ **Manual Attendance** - Mark attendance manually with status options
- 📊 **Dashboard Analytics** - Real-time metrics, weekly charts, department overview
- 🤖 **AI Insights** - Optional OpenAI-powered insights (requires API key)

## Prerequisites

- Python 3.8 or higher
- Webcam (for enrollment and recognition)
- Modern web browser with camera access

## Installation

### 1. Clone or Download

Navigate to the project directory:

```bash
cd "main project"
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** The first installation may take several minutes as it downloads PyTorch and FaceNet models.

### 5. Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Edit `.env` and configure:

```env
ADMIN_KEY=changeme          # Change this to a secure key
THRESHOLD=0.60             # Face recognition threshold (lower = stricter)
HOST=127.0.0.1             # Backend host
PORT=8000                  # Backend port
OPENAI_API_KEY=            # Optional: For AI insights
```

## Running the System

### 1. Start Backend Server (FastAPI + Uvicorn)

```bash
uvicorn backend:app --reload
```

The backend will start at `http://127.0.0.1:8000`

### 2. Start React Frontend (Recommended)

From the `frontend-react` folder:

```bash
cd frontend-react
npm install
npm run dev
```

Then open the URL shown in the console (usually `http://localhost:5173`).

### 3. Legacy Static Frontend (Optional)

Open `frontend/index.html` in your web browser, or use a local server:

**Python:**
```bash
cd frontend
python -m http.server 8080
```

Then open `http://localhost:8080/index.html`

**Node.js:**
```bash
cd frontend
npx http-server -p 8080
```

## Usage

### Enrolling Students

1. Navigate to **Enroll** page
2. Allow camera access when prompted
3. Enter student's full name
4. Click **Capture Image** 5 times (capture from different angles/expressions)
5. Click **Enroll Student**

### Marking Attendance

**Automatic (Face Recognition):**
- Use the recognition endpoint with a captured image
- System automatically marks as "present" if face is recognized

**Manual:**
1. Go to **Attendance** page
2. Enter roll number
3. Select status (Present/Absent/Excused)
4. Optionally set custom timestamp
5. Click **Mark Attendance**

### Managing Students

1. Go to **Students** page
2. View all enrolled students
3. Click **Delete** to remove a student (moved to trash for recovery)

### Dashboard

View real-time analytics:
- Total students
- Today's attendance
- Weekly trends
- Department overview
- Recent check-ins
- System status

## API Endpoints

### Health Check
```
GET /health
```

### Enroll Student
```
POST /enroll
Body: {
  "name": "John Doe",
  "image_base64_list": ["base64_image_1", ..., "base64_image_5"]
}
```

### Recognize Face
```
POST /recognize
Body: {
  "image_base64": "base64_image"
}
```

### Mark Attendance (Auto)
```
POST /attendance/mark
Body: {
  "roll": "001"
}
```

### Mark Attendance (Manual)
```
POST /attendance/manual
Body: {
  "roll": "001",
  "status": "present" | "absent" | "excused",
  "timestamp": "2024-01-01T10:00:00" (optional)
}
```

### Get Attendance
```
GET /attendance
```

### Get Students
```
GET /students
```

### Delete Student
```
DELETE /admin/students/{roll}
Headers: x-admin-key: {ADMIN_KEY}
Body: {
  "confirm": true
}
```

### Analytics Summary
```
GET /analysis/summary?range=7&explain=false
```

## Testing (College Demo Flow)

Follow this flow to verify everything end-to-end:

1. **Run backend**  
   ```bash
   uvicorn backend:app --reload
   ```
2. **Run frontend**  
   ```bash
   cd frontend-react
   npm run dev
   ```
3. **Enroll a student with 5 photos**
   - Go to the Enroll page.
   - Enter the student name.
   - Capture exactly 5 images from slightly different angles.
   - Click **Enroll Student** and wait for the success JSON.
4. **Go to Scan → mark attendance**
   - Open the Scan page.
   - Ensure only one face is in frame.
   - Trigger recognition and then mark attendance for the recognized roll.
5. **Dashboard shows live stats**
   - Open the Dashboard page.
   - Confirm total students, today’s attendance, weekly charts, and recent check-ins load without errors.

## Troubleshooting

### Torch CPU Installation Issues

If you encounter issues installing PyTorch:

1. **Windows:** The CPU wheel should install automatically
2. **macOS:** May need to install from conda:
   ```bash
   conda install pytorch torchvision torchaudio cpuonly -c pytorch
   ```
3. **Linux:** Should work with pip, but if not:
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
   ```

### Face Recognition Not Working

- Ensure good lighting
- Face should be clearly visible
- Try adjusting `THRESHOLD` in `.env` (lower = stricter, higher = more lenient)
- Check that 5 images were captured during enrollment

### Camera Access Denied

- Check browser permissions
- Use HTTPS or localhost (some browsers require this)
- Try a different browser

### Backend Connection Errors

- Ensure backend is running on `http://127.0.0.1:8000`
- Check firewall settings
- Verify CORS is enabled (it is by default)

### Slow Performance

- Face recognition is CPU-based and may be slower on older machines
- First recognition after startup takes longer (model loading)
- Consider using GPU version of PyTorch for better performance (requires CUDA)

## File Structure

```
smart_attendance/
├── backend.py              # FastAPI backend server
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── data/
│   ├── students.json      # Student database
│   ├── attendance.json    # Attendance records
│   ├── faces/             # Student face images
│   └── trash/             # Deleted student backups
└── frontend/
    ├── index.html         # Dashboard
    ├── enroll.html        # Enrollment page
    ├── students.html      # Student management
    ├── attendance.html    # Attendance logs
    ├── styles.css         # Apple-premium styling
    ├── main.js            # Dashboard logic
    ├── enroll.js          # Enrollment logic
    ├── students.js        # Student management logic
    ├── attendance.js      # Attendance logic
    └── assets/            # Static assets
```

## Admin Actions

### Changing Admin Key

Edit `.env`:
```env
ADMIN_KEY=your_secure_key_here
```

### Recovering Deleted Students

Deleted students are stored in `data/trash/{timestamp}_student_{roll}/`:
- `student_data.json` - Full student data
- Face images - All 5 original images

To recover, manually copy the data back to `data/students.json` and images to `data/faces/`.

## AI Insights (Optional)

To enable AI-powered insights:

1. Get an OpenAI API key from https://platform.openai.com
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Use `explain=true` parameter in analytics endpoint

## Security Notes

- Change `ADMIN_KEY` from default "changeme"
- Don't commit `.env` file to version control
- Use HTTPS in production
- Consider adding authentication for production use

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Check browser console and backend logs for errors

---

**Built with ❤️ using FastAPI, FaceNet PyTorch, and modern web technologies.**

