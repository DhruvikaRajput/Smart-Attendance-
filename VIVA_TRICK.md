# Viva Questions - Trick Level

Tricky questions that examiners use to test deep understanding. These questions often have hidden assumptions or require thinking about edge cases.

---

## Q: Why can't we skip this check? (referring to validation)

**Answer:**
Validation checks prevent invalid or malicious data from entering the system. If we skip validation:
- Users could send malformed data that crashes the system
- Security vulnerabilities (like injection attacks)
- Data corruption (invalid formats break file structure)
- System instability (unexpected data causes errors)

**Example:** If we skip roll number validation, a user could send `"../../etc/passwd"` which could be a security risk, or `null` which would break the JSON structure.

**Key Point:** Validation is a security and stability measure, not just convenience.

---

## Q: What is the difference between storing and processing data?

**Answer:**
**Storing data** means saving it to files (like writing to JSON files). It's persistent - data survives server restarts. Examples: saving student info to `students.json`, saving attendance records.

**Processing data** means manipulating or analyzing it in memory (like calculating statistics, comparing face patterns). It's temporary - happens during request handling, then results are returned.

**Key Difference:**
- Storage = Long-term, persistent, on disk
- Processing = Short-term, in memory, during execution

**Why it matters:** You can process data without storing it (like calculating stats), but you can't retrieve stored data without processing it (like reading from file).

---

## Q: What happens if two users request at the same time?

**Answer:**
FastAPI handles concurrent requests, but there's a race condition with file writes:
1. Both requests read the same file
2. Both modify the data
3. Both write back
4. Last write wins (first write is lost)

**Current System:**
- Reads are safe (multiple can happen simultaneously)
- Writes can conflict (data loss possible)
- No file locking mechanism

**What Should Happen:**
- Use file locking or database transactions
- Queue write operations
- Use atomic operations (which we do, but still can lose data if two writes happen)

**Real Impact:** In a classroom with 30 students scanning at once, some attendance records might be lost if they all hit the server simultaneously.

---

## Q: Why can't we just use one JSON file for everything?

**Answer:**
We could, but it would be inefficient:
1. **Performance:** Every operation would need to read/write the entire file (slow)
2. **Concurrency:** More conflicts when multiple operations happen
3. **Memory:** Loading everything into memory even when only needing one piece
4. **Backup:** Harder to backup specific data types
5. **Organization:** Harder to find and manage specific data

**Current Design:**
- `students.json` - Student data (read during enrollment, student list)
- `attendance.json` - Attendance records (read for dashboard, stats)
- `embeddings.json` - Face patterns (read during recognition - most frequent)

**Why Separate:**
- Recognition happens most often - `embeddings.json` is optimized for speed
- Smaller files = faster reads
- Can update one without affecting others

---

## Q: What happens if the face recognition model fails to initialize?

**Answer:**
The system checks if `face_mesh` is None:
1. If initialization fails, `face_mesh = None`
2. Recognition endpoints check this and return error
3. Enrollment would fail (can't extract embeddings)
4. System would be partially functional (can still view data, but can't recognize faces)

**Current Handling:**
- Health check endpoint shows model status
- Functions return appropriate errors
- But system doesn't automatically recover

**What Should Happen:**
- Retry initialization
- Fallback to manual attendance only
- Alert administrators
- Log the error for debugging

---

## Q: Why do we need both students.json and embeddings.json? Isn't that redundant?

**Answer:**
It's intentional redundancy for performance:
- `students.json` has complete data (for display, management)
- `embeddings.json` has only recognition data (for speed)

**Why Not Just One:**
- Recognition happens 100+ times per day (needs to be fast)
- Student list viewed maybe 10 times per day (can be slower)
- Loading full student data for recognition wastes memory and time

**Trade-off:**
- Data duplication (need to keep in sync)
- But 10x faster recognition (worth it)

**If Removed:**
- Recognition would be slower (loading full student data each time)
- But would work (just slower)

---

## Q: What if a student's face changes? (glasses, beard, etc.)

**Answer:**
Current system doesn't handle this automatically:
- Old embeddings might not match new appearance
- Recognition could fail
- Student would need to re-enroll

**Limitations:**
- No automatic retraining
- No update mechanism for embeddings
- Manual re-enrollment required

**What Should Happen:**
- System should allow updating embeddings
- Or use multiple embeddings per student (old + new)
- Or retrain when recognition confidence drops

**Current Workaround:**
- Delete and re-enroll student
- Or use manual attendance

---

## Q: Why do we use base64 encoding for images instead of sending files directly?

**Answer:**
Base64 encoding converts binary image data to text, which can be sent in JSON:
- JSON only supports text (not binary)
- HTTP requests can send JSON easily
- Single request contains everything (no separate file upload)

**Trade-offs:**
- **Pros:** Simple, works with JSON API, single request
- **Cons:** 33% larger size, more processing (encode/decode)

**Alternative:**
- Multipart form data (smaller, but more complex)
- Direct file upload (requires different endpoint)

**Why Base64 Here:**
- Simpler implementation
- Works well for small images (webcam photos)
- Good enough for this use case

---

## Q: What happens if the server crashes while writing a file?

**Answer:**
With atomic operations:
1. Write happens to temp file first
2. Only replaces original if write succeeds
3. If crash happens during write, temp file is lost but original is safe
4. If crash happens after write but before replace, temp file exists (can recover)

**Without Atomic Operations:**
- File could be partially written (corrupted)
- Data loss possible
- System might not start (corrupted JSON)

**Current Protection:**
- Atomic write operations
- Retry logic (3 attempts)
- Auto-recovery for corrupted files (reads)

**Still Vulnerable To:**
- Power loss during write (but original file safe)
- Disk failure (no protection)

---

## Q: Why can't we recognize faces in real-time video instead of single photos?

**Answer:**
We could, but it adds complexity:
1. **Processing:** Video = many frames per second (30+), photos = one at a time
2. **Bandwidth:** Video streams are large, photos are small
3. **Accuracy:** Single clear photo often better than video frames
4. **Simplicity:** Photo capture is easier to implement

**Current Approach:**
- User clicks to capture (ensures good frame)
- Single photo = faster processing
- Less data to transfer

**Video Would Need:**
- Frame extraction (which frame to use?)
- Continuous processing (more CPU)
- Larger data transfer
- More complex code

**Trade-off:**
- Video: More natural, but complex and resource-intensive
- Photos: Simpler, faster, sufficient for this use case

---

## Q: What if someone sends a photo of a photo (spoofing attack)?

**Answer:**
Current system doesn't detect this:
- Would recognize the face in the photo
- Could mark attendance for someone not actually present
- Security vulnerability

**Limitations:**
- No liveness detection
- No anti-spoofing measures
- Relies on physical presence (camera access)

**What Should Happen:**
- Liveness detection (blink detection, head movement)
- 3D face analysis (depth detection)
- Challenge-response (ask user to move head)

**Current Mitigation:**
- Requires camera access (can't use pre-taken photo easily)
- But determined attacker could still spoof

---

## Q: Why do we store images as JPG instead of PNG?

**Answer:**
JPG is better for photos:
- **Smaller file size** (important for storage and transfer)
- **Faster processing** (smaller = faster to read/write)
- **Good quality** for photos (faces don't need lossless)

PNG would be:
- Larger files (2-3x bigger)
- Slower to process
- Unnecessary quality (faces don't need pixel-perfect)

**Trade-off:**
- JPG: Smaller, faster, slight quality loss (imperceptible for faces)
- PNG: Larger, slower, perfect quality (not needed here)

**Best Practice:**
- JPG for photos (this project)
- PNG for graphics, screenshots (not this project)

---

## Q: What happens if we have 1000 students? Will the system still work?

**Answer:**
Current system would have performance issues:
1. **Recognition:** Compares with all 1000 students (slow - O(n) complexity)
2. **File size:** Large JSON files (slow to read/write)
3. **Memory:** Loading all embeddings into memory (high memory usage)

**Current Limits:**
- Works fine for < 100 students
- Starts slowing down at 200-300 students
- Would be very slow at 1000 students

**What Would Need to Change:**
- Use database instead of JSON files
- Index embeddings for faster search
- Use approximate nearest neighbor search (like FAISS)
- Pagination for student lists
- Caching for frequently accessed data

**Scalability:**
- Current: Good for small-medium classes (10-200 students)
- Production: Would need database and optimization

---

## Q: Why do we check permissions for delete but not for read?

**Answer:**
**Read operations** are generally safe:
- Viewing data doesn't change anything
- No risk of data loss
- Faster (no permission checks)

**Delete operations** are dangerous:
- Permanent data loss (moved to trash, but still)
- Could delete wrong student
- Needs admin confirmation

**Security Principle:**
- Least privilege: Only restrict what's dangerous
- Read = safe, so no restriction
- Write/Delete = dangerous, so restrict

**Trade-off:**
- More security = more checks = slower
- Balance: Protect dangerous operations, allow safe ones

---

## Q: What if the threshold is too high or too low?

**Answer:**
**Too Low (0.15):**
- Very strict matching
- Fewer false positives (won't match wrong person)
- More false negatives (might not recognize correct person)
- Students might not be recognized (frustrating)

**Too High (0.40):**
- Very lenient matching
- More false positives (might match wrong person)
- Fewer false negatives (recognizes more)
- Wrong students might be marked present (serious problem)

**Current (0.25):**
- Balanced
- Good accuracy
- Tuned for this use case

**How to Tune:**
- Test with real students
- Adjust based on results
- Lower if too many false positives
- Higher if too many false negatives

---

## Tips for Trick Questions

1. **Don't Panic:** These questions test thinking, not just memorization
2. **Think About Edge Cases:** What could go wrong?
3. **Consider Trade-offs:** Every design has pros and cons
4. **Admit Limitations:** It's okay to say "current system doesn't handle this, but here's what should happen"
5. **Show Understanding:** Even if you don't know the answer, show you understand the concepts

---

## Common Trick Question Patterns

1. **"Why can't we...?"** - Testing if you understand the purpose
2. **"What if...?"** - Testing edge case thinking
3. **"What's the difference...?"** - Testing conceptual understanding
4. **"What happens when...?"** - Testing system behavior knowledge
5. **"Why not...?"** - Testing if you considered alternatives

Remember: These questions want to see if you understand the "why" behind design decisions, not just the "what."

