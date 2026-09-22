# AlumniConnect — Mentorship & Networking Platform

> **AlumniConnect** is a full-stack web platform connecting college alumni and students through mentorship, job referrals, events, and real-time messaging. Built by **Team 9** for KIET, KIEW, and KIEK institutions.

---

## 🚀 Live Deployment

| Service | URL |
|:--------|:----|
| **Backend API** | https://alumini-connect-08od.onrender.com |
| **Frontend** | *(Deploy as Render Static Site — see below)* |

---

## 🏗️ Project Structure

```
alumni_connect/
├── backend/              # Node.js + Express REST API
│   ├── src/
│   │   ├── config/       # Database & JWT configuration
│   │   ├── controllers/  # Route handler logic
│   │   ├── middleware/   # Auth & error middleware
│   │   ├── models/       # Mongoose schemas (User, Alumni, Student, etc.)
│   │   ├── routes/       # Express route definitions
│   │   ├── seed/         # Database seeder (admin accounts, sample data)
│   │   └── utils/        # Helpers (notifications, sync, validators)
│   ├── importAlumni.js   # One-time script to bulk-import alumni from data
│   ├── importStudents.js # One-time script to bulk-import students from data
│   ├── app.js            # Express app setup (CORS, routes, middleware)
│   ├── server.js         # Entry point (DB connect, seed, start server)
│   ├── .env.example      # Environment variable template
│   └── package.json
│
└── frontend/             # React + Vite SPA
    ├── src/
    │   ├── api/          # Axios API service modules per feature
    │   ├── components/   # Reusable UI components (charts, sidebar, header)
    │   ├── context/      # NotificationContext (global state)
    │   ├── lib/          # Auth context, API client, utilities
    │   ├── pages/        # Role-based page views (admin, alumni, student, auth)
    │   └── App.jsx       # Root app with routing and auth gate
    ├── index.html
    └── package.json
```

---

## ⚙️ Technology Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React 19, Vite, TailwindCSS 4, Recharts, Lucide Icons |
| **Backend** | Node.js, Express 5, JWT Authentication, bcrypt |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Deployment** | Render (Web Service + Static Site) |

---

## 👥 User Roles

| Role | Description |
|:-----|:------------|
| **Administrator** | Full platform access — manage alumni, students, events, analytics |
| **Alumni** | Mentor students, post job referrals, attend events, message students |
| **Student** | Find alumni mentors, request mentorships, apply for referrals, join events |

---

## 🔑 Default Login Credentials

> These accounts are pre-seeded in the database on every server startup.

### Administrator
| Email | Password |
|:------|:---------|
| `kietgroup@gmail.com` | `kiet123` |
| `admin@alumniconnect.com` | `Admin@123` |

### Alumni & Students
All imported alumni and students use:
- **Password / PIN:** `1234`
- **Email:** As listed in the import spreadsheet (e.g., `rahul.sharma@kiet.edu`)

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/NadipilliAditya/Team-9.git
cd Team-9
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm install
npm start
```

Backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## 🌐 Deploying on Render

### Backend — Web Service
| Setting | Value |
|:--------|:------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

**Environment Variables required:**
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/alumniconnect
JWT_SECRET=your_secret_key
PORT=10000
```

### Frontend — Static Site
| Setting | Value |
|:--------|:------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**Redirect Rule** (for SPA routing):
- Source: `/*` → Destination: `/index.html` → Action: `Rewrite`

---

## 📡 API Endpoints

| Endpoint | Description |
|:---------|:------------|
| `GET /` | Health check & endpoint overview |
| `POST /api/auth/register` | Register new alumni or student |
| `POST /api/auth/login` | Login with email, password, and role |
| `GET /api/auth/me` | Get authenticated user profile |
| `GET /api/alumni` | List all alumni |
| `GET /api/students` | List all students |
| `GET /api/events` | List all events |
| `GET /api/mentorships` | List mentorships |
| `POST /api/mentorships` | Request a mentorship |
| `GET /api/referrals` | List job referrals |
| `GET /api/messages` | Get messages |
| `GET /api/notifications` | Get notifications |
| `GET /api/analytics/overview` | Platform analytics overview |
| `GET /api/health` | Database health check |

---

## 🌟 Key Features

- **Role-based dashboards** — Separate views for Admin, Alumni, and Student
- **Mentorship System** — Students request 1-on-1 mentorships; alumni accept/decline
- **Job Referrals** — Alumni post referrals; students apply
- **Events Management** — Create, manage, and attend campus & virtual events
- **Real-time Notifications** — Live notification polling for all users
- **Analytics Dashboard** — Admin analytics: engagement, department breakdowns, mentorship trends
- **Secure Authentication** — JWT-based role-enforced login with bcrypt password hashing
- **MongoDB Sync** — Automatic sync of alumni & student records with User login accounts on startup

---

## 👨‍💻 Team

**Team 9 — KIET Group of Institutions**
- Built under the **C4GT (Code for GovTech)** programme
- Institutions: KIET · KIEW · KIEK

---

## 📄 License

This project is built for educational and government technology purposes under the C4GT initiative.