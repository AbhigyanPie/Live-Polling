# Live Polling System

A robust, real-time web application for interactive classroom polling, enabling seamless engagement between teachers and students. Built with React, Redux, Express.js, Supabase, and Socket.IO, the platform ensures instant updates, per-tab user isolation, and a modern, intuitive interface.

Hosted-link : https://live-polling-2ree.vercel.app/
---

## 🚀 Features & Data Flow

### 1. Role-Based Entry & Per-Tab Identity

- **Role Selection:**  
  On launch, users select either "Student" or "Teacher" to access their respective dashboards.
- **Per-Tab Unique Student Identity:**  
  Students enter their name only once per browser tab. The name is stored in `sessionStorage` and Redux, ensuring:
  - Each tab acts as a unique student.
  - Refreshing the tab retains the name; opening a new tab prompts for a new name.
- **Redux State Management:**  
  User role, name, and tab ID are managed in Redux for consistent access across the app.

---

### 2. Teacher Poll Management

- **Poll Creation:**  
  Teachers can create new polls with:
  - Custom question text.
  - Dynamic options (add/remove).
  - Timer selection from a dropdown (10, 20, 30, 45, 60 seconds).
  - Optionally mark correct answers.
- **Poll Data Storage:**  
  On submission, poll data is sent to the backend and stored in Supabase, including question, options, timer, and teacher ID.
- **Poll History:**  
  Teachers see a list of all previous and active polls, with real-time updates as new polls are created.

---

### 3. Real-Time Polling & Results (Socket.IO)

- **Live Updates:**  
  All poll creation, question activation, and results are broadcast instantly to all connected students and teachers using Socket.IO.

---

### 4. Student Experience & Data Flow

- **Loader State:**  
  Students initially see a loader ("Wait for the teacher to ask questions...") until a poll is activated.
- **Question Display & Answer Submission:**  
  - Students see the current question and options.
  - A ticking timer (from the poll's duration) is shown above the question.
  - Students select an answer and submit; their response is stored in Supabase, linked to their unique tab/session.
- **Auto-Advance & Results:**  
  - If the timer expires (max 60 seconds), the answer is locked and results are shown automatically.
  - After viewing results, students can proceed to the next question if available.
- **Iterative Flow:**  
  - The system iterates through all active polls, ensuring each student answers every question only once.
  - Answered poll IDs are tracked in `sessionStorage` and Redux to prevent repeat submissions, even after refresh.

---

### 5. Poll Results Visualization

- **Live Results for Students & Teachers:**  
  - After answering (or when time expires), students see a real-time breakdown of poll results, including percentage bars for each option.
  - Teachers see a similar results view, updated live as students respond.
- **Poll History:**  
  - Both students and teachers can scroll through all previous polls and their results, with clear, modern visualizations.

---

## 🗂️ Data Storage & Flow

| Action                | Where Data Is Stored                | How Data Flows                                 |
|-----------------------|-------------------------------------|------------------------------------------------|
| Student name/tab      | `sessionStorage`, Redux             | Set on first entry, persists per tab           |
| Poll creation         | Supabase (polls table)              | POST from teacher UI, broadcast via Socket.IO  |
| Answer submission     | Supabase (responses table)          | POST from student UI, linked to poll/student   |
| Timer value           | Supabase (per poll), Redux (timer)  | Pulled from poll, started in Redux per question|
| Results calculation   | Supabase (responses), Redux         | Aggregated on backend, sent to frontend        |
| Poll history/results  | Supabase, Redux                     | Fetched on load, updated live via Socket.IO    |

---

## 🛠️ Technologies Used

- **Frontend:** React, Redux, CSS Modules
- **Backend:** Express.js, Socket.IO
- **Database:** Supabase (PostgreSQL)
- **Design:** Figma
- **Real-Time:** Socket.IO for instant updates

---

## 🧩 Project Flow Summary

1. **User selects role (Student/Teacher) →**  
   Student enters name (unique per tab) or Teacher lands on poll creation page.

2. **Teacher creates poll →**  
   Poll is stored in Supabase and broadcast to all students in real time.

3. **Student sees loader, then question with timer →**  
   Timer starts from poll's duration; student submits answer or timer expires.

4. **Answer is stored, results shown live →**  
   Both student and teacher see real-time results; student advances to next question.

5. **All polls and results are visible in history →**  
   Students and teachers can review past questions and results at any time.

---

## 📈 Why This System Stands Out

- **True real-time experience** for both students and teachers.
- **Per-tab student isolation** for realistic classroom simulation.
- **Iterative, single-page flow** for seamless answering and results.
- **Robust data integrity** with Supabase and Redux.
- **Modern, responsive UI** inspired by Figma designs.
- **Extensible for chat, analytics, and more.**

---

