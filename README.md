# 📋 Attachment Management System (AMS)

A full-stack web platform that digitizes and streamlines the entire student industrial attachment (internship) process — connecting students, industry supervisors, university supervisors, and school administrators in one place.

---

## 🧩 The Problem It Solves

Managing student industrial attachments is traditionally a mess of paperwork, physical logbooks, phone calls, and manual sign-offs. Key pain points include:

- **No real-time visibility** — Universities can't track student attendance or progress without physical visits.
- **Paper logbooks** — Easily lost, damaged, or falsified. No way to verify entries after the fact.
- **Scattered communication** — Students, industry supervisors, and university staff coordinate through emails and calls with no central record.
- **Inconsistent assessments** — No standardized way to evaluate students across different industries.
- **Manual admin overhead** — School administrators spend hours managing student placements, generating reports, and chasing updates.

---

## ✅ How AMS Solves It

AMS replaces the entire manual workflow with a centralized digital platform:

| Feature | What It Does |
|---|---|
| **Digital Logbooks** | Students submit daily work logs online; supervisors review and approve them digitally. |
| **QR Attendance** | Students check in/out via QR code scan, giving supervisors a tamper-proof attendance record. |
| **Assessments** | University and industry supervisors conduct structured evaluations directly on the platform. |
| **Meeting Scheduler** | University supervisors can schedule and manage visits/meetings with their assigned students. |
| **Communication Hub** | Built-in messaging between students and supervisors — no need for external apps. |
| **School Admin Dashboard** | Admins manage student registrations, school profiles, and generate PDF reports. |
| **Super Admin Panel** | Platform-wide oversight: manage all schools, users, system settings, and audit logs. |
| **AI-Assisted Reports** | Student logbook entries can be refined into formal technical reports automatically. |
| **Student ID Cards** | Generate printable student ID cards with school branding and student details. |

---

## 👥 User Roles

The system supports **6 distinct roles**, each with their own dashboard and permissions:

| Role | Access |
|---|---|
| **Student** | Submit logbooks, view attendance, check assessments, message supervisors |
| **Industry Supervisor** | Mark attendance, review/approve logbooks, assess students, message students |
| **University Supervisor** | Assess students, schedule meetings, view assigned students' progress |
| **School Admin** | Manage students & supervisors for their school, generate reports |
| **Super Admin** | Manage all schools, users, system settings, and view audit logs |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) — Fast, component-based UI
- **Material 3 Design** — Clean, modern interface with school branding support
- **Framer Motion** — Smooth animations and page transitions
- **Context API** — Global auth and session state management

### Backend
- **Node.js + Express.js** — RESTful API server
- **Sequelize ORM + MySQL** — Relational database with structured data models
- **JWT Authentication** — Secure, role-based access control
- **Helmet.js** — Security headers for production hardening
- **PDFKit** — Server-side PDF generation for reports and ID cards
- **Multer** — File upload handling (photos, documents)

---

## 📁 Project Structure

```
AMS/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── pages/            # Role-specific dashboards & pages
│       │   ├── student/
│       │   ├── industry/
│       │   ├── university/
│       │   ├── school_admin/
│       │   ├── admin/
│       │   └── superadmin/
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth & branding context
│       └── utils/            # Axios API helpers
│
├── server/                   # Node.js + Express backend
│   ├── controllers/          # Business logic & request handlers
│   ├── models/               # Sequelize data models
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── School.js
│   │   ├── Logbook.js
│   │   ├── Attendance.js
│   │   ├── Assessment.js
│   │   ├── Meeting.js
│   │   ├── Message.js
│   │   └── AuditLog.js
│   ├── routes/               # API route definitions
│   ├── middleware/           # Auth & role-based access middleware
│   ├── services/             # PDF generation, AI report refinement
│   └── utils/                # Shared utilities
│
├── DEPLOYMENT_GUIDE.md
├── RUN_GUIDE.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL database
- npm

### 1. Clone the repository
```bash
git clone https://github.com/AlvinMutie/AM-System.git
cd AM-System
```

### 2. Configure the backend
Create a `.env` file in the `/server` directory:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=ams_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

### 3. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the development servers
```bash
# In /server
npm run dev

# In /client (separate terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

> For full deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).  
> For a quick local run walkthrough, see [RUN_GUIDE.md](./RUN_GUIDE.md).

---

## 🔐 Default Login Credentials

After seeding the database, you can log in with the following test accounts:

| Role | Email | Password |
|---|---|---|
| Super Admin | `superadmin@ams.com` | `password123` |
| School Admin | `schooladmin@ams.com` | `password123` |
| Student | `student@ams.com` | `password123` |
| Industry Supervisor | `industry@ams.com` | `password123` |
| University Supervisor | `university@ams.com` | `password123` |

> ⚠️ Change all default passwords before deploying to production.

---

## 👨‍💻 Developer

**Alvin Mutie**  
Software Engineer  
📧 [mutiealvin0@gmail.com](mailto:mutiealvin0@gmail.com)  
🐙 [github.com/AlvinMutie](https://github.com/AlvinMutie)

---

*© 2026 AMS Project. All Rights Reserved.*
