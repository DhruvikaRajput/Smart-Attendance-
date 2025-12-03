# Files in Root Folder - Explanation

## backend.py

**What it does:**
This is the main server file. It's like the brain of the entire system. It handles all the important work like recognizing faces, saving attendance, and managing students.

**Why it exists:**
Without this file, the system cannot work. It's the only way the frontend can communicate with the data storage. It acts as a bridge between what users see and where information is stored.

**How it connects with other files:**
- Reads from `data/students.json` to get student list
- Reads from `data/attendance.json` to get attendance records
- Reads from `data/embeddings.json` for fast face matching
- Saves images to `data/faces/` folder
- Receives requests from `frontend-react/src/api/api.js`
- Uses libraries from `requirements.txt`

**What problem it solves:**
- Provides a way for the frontend to access data
- Handles complex face recognition logic
- Keeps all data organized and safe
- Prevents direct file access (security)

---

## requirements.txt

**What it does:**
Lists all the Python packages (libraries) needed to run the backend. It's like a shopping list for the computer.

**Why it exists:**
When someone wants to run this project, they need to install the same libraries. This file tells them exactly what to install.

**How it connects with other files:**
- Used by `backend.py` (all those libraries are imported there)
- When you run `pip install -r requirements.txt`, it installs everything needed

**What problem it solves:**
- Ensures everyone has the same tools
- Makes installation easy (one command)
- Prevents "missing library" errors

---

## README.md

**What it does:**
A guide that explains how to set up and use the project. It's like an instruction manual.

**Why it exists:**
Helps new users understand what the project is and how to get it running. Without it, people would be confused about where to start.

**How it connects with other files:**
- References `backend.py` (how to run it)
- References `requirements.txt` (how to install dependencies)
- References `frontend-react/` (how to run frontend)
- References `.env` file (configuration)

**What problem it solves:**
- Reduces confusion for new users
- Provides step-by-step setup instructions
- Explains troubleshooting

---

## SETUP_GUIDE.md

**What it does:**
Detailed instructions for setting up the project from scratch. More detailed than README.

**Why it exists:**
Some users need more detailed steps. This file provides extra help for installation and configuration.

**How it connects with other files:**
- Explains how to configure `.env` file
- Shows how to run `backend.py`
- Guides through `frontend-react/` setup

**What problem it solves:**
- Helps users who are stuck
- Provides alternative setup methods
- Explains configuration options

---

## package-lock.json

**What it does:**
Locks the exact versions of Node.js packages. Ensures everyone uses the same versions.

**Why it exists:**
Prevents version conflicts. If one person uses version 1.0 and another uses 2.0, things might break. This file prevents that.

**How it connects with other files:**
- Related to `frontend-react/package.json`
- Used by npm when installing frontend dependencies

**What problem it solves:**
- Prevents "it works on my computer" problems
- Ensures consistent behavior across different computers

---

## .gitignore (if exists)

**What it does:**
Tells Git (version control) which files to ignore. Prevents uploading unnecessary files.

**Why it exists:**
Some files shouldn't be shared (like `venv/`, `__pycache__/`, `.env`). This file keeps them private.

**How it connects with other files:**
- Excludes `venv/` (virtual environment)
- Excludes `__pycache__/` (Python cache)
- Excludes `.env` (secret keys)

**What problem it solves:**
- Keeps repository clean
- Protects sensitive information
- Reduces upload size

---

## Summary

The root folder contains:
- **backend.py** - The main server (most important file)
- **requirements.txt** - Python dependencies list
- **README.md** - User guide
- **SETUP_GUIDE.md** - Detailed setup instructions
- **package-lock.json** - Node.js version lock
- Configuration and documentation files

These files are the foundation of the project. They tell the system what to do and how to set it up.

