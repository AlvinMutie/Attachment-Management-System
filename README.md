# Attachment Management System (AMS)

An enterprise-grade, multi-tenant university platform designed to digitize, streamline, and govern the complete industrial attachment (internship) lifecycle. AMS connects students, host company industry supervisors, university visiting supervisors, attachment coordinators, school administrators, and system super administrators into a single unified, secure workflow.

---

## Table of Contents
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Key Features & Role Matrix](#key-features--role-matrix)
- [Comprehensive Test Suite & Verification (29 Categories)](#comprehensive-test-suite--verification-29-categories)
- [Local Installation & Setup](#local-installation--setup)
- [Default Login Credentials](#default-login-credentials)
- [Production Hardening & Disaster Recovery](#production-hardening--disaster-recovery)
- [Documentation Catalog](#documentation-catalog)
- [License & Authors](#license--authors)

---

## System Architecture

AMS is structured as a decoupled client-server architecture with strict multi-tenant isolation, centralized academic policy enforcement, explainable risk scoring, and transactional point-in-time database snapshotting.

```mermaid
graph TD
    subgraph Client Layer
        Web[React 19 / Vite SPA]
        Mobile[Flutter Mobile Client]
    end

    subgraph Security & API Gateway Layer
        Nginx[Nginx Reverse Proxy / SSL]
        Helmet[Helmet Security Headers]
        CORS[Configurable CORS]
        Limiter[Granular Rate Limiters]
        Trace[Request Correlation X-Request-ID]
        Auth[JWT + Role-Based Access Control]
    end

    subgraph Core Services Layer
        AuthSvc[Auth & User Service]
        PolicySvc[Academic Policy Service]
        WorkflowSvc[Attachment & Logbook Service]
        SupervisionSvc[Supervision & Assessment Service]
        AnalyticsSvc[Institutional Analytics Engine]
        InsightSvc[Deterministic Insight Engine]
        RiskSvc[Operational Risk Scorer 0-100]
        DocSvc[Secure Document Vault]
        AuditSvc[Structured Audit Logger]
    end

    subgraph Data & Storage Layer
        Sequelize[Sequelize 6 ORM]
        DB[(SQLite 3 Database)]
        Backup[VACUUM INTO Backup Vault]
        Uploads[Sanitized Uploads Storage]
    end

    Web --> Nginx
    Mobile --> Nginx
    Nginx --> Helmet --> CORS --> Limiter --> Trace --> Auth
    Auth --> Core Services Layer
    Core Services Layer --> Sequelize
    Sequelize --> DB
    DB --> Backup
    DocSvc --> Uploads
```

### Architectural Highlights
- **Tenant Context Derivation**: Multi-tenancy is enforced by extracting `schoolId` directly from the validated JWT token session context rather than trusting client-supplied parameters.
- **Authoritative Academic Policy**: All compliance calculations (attendance thresholds, logbook review cadences, supervision visit rules) are centralized in `academicPolicyService.js`.
- **Explainable Decision Support**: Diagnostic insights and 0–100 bounded risk scores are deterministically computed with structured evidence; ML models remain governed under `EXPERIMENTAL_NOT_PRODUCTION_READY` until statistically adequate historical samples ($N \ge 50$) accumulate.

---

## Technology Stack

### Frontend
- **Framework**: React 19 (Single Page Application)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with custom institutional color token themes
- **Routing**: React Router with route-level code splitting and lazy loading
- **Icons & UI Primitives**: Lucide React, Framer Motion
- **HTTP Client**: Axios with interceptors for JWT injection and request correlation

### Backend
- **Runtime**: Node.js (>=20.0.0 LTS)
- **Web Framework**: Express 4
- **ORM / Data Layer**: Sequelize 6
- **Database**: SQLite 3 (with non-destructive schema synchronization and MySQL/Postgres dialect capability)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing (salt factor 10)
- **Security**: `helmet`, custom in-memory IP rate limiting, input boundary validation
- **File Handling & Reports**: `multer` with MIME and path traversal sanitization, `pdfkit`, `csv-parser`

### Mobile
- **Framework**: Flutter with cross-platform RESTful API consumer services

---

## Key Features & Role Matrix

AMS natively supports 6 distinct application roles with specialized workspaces and granular permissions:

| Role | Core Capabilities |
|---|---|
| **Student** | Apply for placements, QR daily check-in, weekly logbook submission & resubmission, view supervisor evaluations, access unified progress workspace. |
| **Industry Supervisor** | Verify daily student attendance, review/approve/reject weekly logbooks with revision feedback, complete industry supervisor assessments. |
| **University Supervisor** | Track assigned student rosters, schedule and record on-site/virtual supervision visits, submit academic evaluation grades. |
| **Attachment Coordinator** | Oversee institutional attachment funnels, manage host company directory, allocate/reassign supervisors with audit history, evaluate completion readiness. |
| **School Admin** | Manage student and supervisor user accounts, configure institutional settings/branding, generate PDF/CSV reports, audit data quality and analytics. |
| **Super Admin** | Manage multi-tenant school onboarding, platform-wide user directory, global system health diagnostics, and platform security audit logs. |

---

## Comprehensive Test Suite & Verification (29 Categories)

The AMS automated verification suite (`server/test_verification.js`) executes 115 rigorous end-to-end integration tests across 29 distinct architectural categories:

```text
==========================================
TEST SUMMARY: 115 Passed, 0 Failed (100% Green)
==========================================
```

### Detailed Catalog of Test Categories

1. **Authentication & Credential Verification**: Validates successful login token issuance, rejection of incorrect passwords, handling of empty/missing credentials, authenticated profile retrieval via `/api/auth/me`, and rejection of tampered/malformed JWT tokens.
2. **Privilege Escalation & Registration Protection**: Verifies that public registration endpoints strictly reject attempts to self-assign privileged roles (`super_admin`, `school_admin`, `attachment_coordinator`), while permitting valid student and supervisor registration.
3. **Role-Based Access Control (RBAC) Matrix**: Tests explicit permission boundaries across all 6 roles, verifying that unauthorized role attempts (e.g., student calling admin endpoints) receive `403 Forbidden`.
4. **Multi-Tenant Data Isolation**: Confirms strict data boundary enforcement, ensuring School B administrators cannot see or manipulate School A student records.
5. **Placement & Attachment Lifecycle Management**: Tests complete placement workflow from initial application, school admin review, approved state locking, through supervisor pairing.
6. **Attendance Workflow & Duplicate Prevention**: Verifies daily check-in recording, rejection of duplicate daily entries (`400 Bad Request`), and authorized supervisor attendance inspection.
7. **Weekly Logbook Lifecycle & Approvals**: Validates student logbook submissions, supervisor review queues, and state transitions to approved status.
8. **Academic Supervision & Assessment Grading**: Tests university supervisor roster inspection, student academic summaries, supervisor assessment grading submission, and student grade visibility.
9. **In-App Notifications & State Management**: Validates lifecycle event notification creation, unread badge calculation, and mark-all-read updates.
10. **Hardened Messaging & Cross-Tenant Communication Protection**: Tests direct messaging between authorized student-supervisor pairs and verifies rejection of cross-tenant or unassigned communications.
11. **Reports Engine & Clean CSV Exports**: Verifies paginated tabular report generation and streaming CSV exports for placements, attendance, logbooks, and assessments.
12. **Deterministic Operational Alerts Engine**: Tests automated institutional alert calculation for low attendance, pending logbooks, and unassigned students.
13. **Attachment Coordinator Role & Dedicated Oversight**: Tests coordinator dashboard access, priority attention queues, and supervisor management.
14. **Coordinator Multi-Tenant & IDOR Defenses**: Verifies that coordinators cannot access student details or assign supervisors across different tenant schools.
15. **Supervisor Workload Allocation & Reassignment Audit Trail**: Tests live supervisor workload capacity metrics and verifies auditable historical records for supervisor reassignments.
16. **Host Organization Directory & Completion Readiness Diagnostics**: Validates company directory registration and explainable academic completion blocker diagnostics.
17. **Centralized Academic Policy Service & Compliance Engine**: Tests authoritative attendance compliance calculations (`COMPLIANT` at $\ge 75\%$, `AT_RISK` at $60\text{--}74\%$, `CRITICAL` at $< 60\%$).
18. **Student Unified Attachment Workspace & Action Queue**: Validates consolidated milestone progression and actionable task queues for students.
19. **Supervisor Workspaces & Compliance Oversight Streams**: Tests specialized action queues and compliance metrics for industry and university supervisors.
20. **Secure Evidence & Document Vault**: Tests path traversal protection against `../` attack sequences, MIME type validation, and authenticated document streaming.
21. **Logbook Revision Workflow & State Machine**: Tests complete rejection $\to$ revision $\to$ resubmission $\to$ re-review state machine and blocks tampering with approved logs.
22. **Advanced Analytics Aggregation & Longitudinal Trends**: Validates institutional KPI computation (funnels, attendance rates, grade distributions) and 6-month longitudinal monthly trends.
23. **Deterministic Insight Engine & Diagnostic Evidence**: Verifies rule-based diagnostic insight generation (`ATTENDANCE_DECLINE`, `OVERDUE_LOGBOOK`, `REPEATED_LOGBOOK_REVISION`) with structured evidence.
24. **Explainable Operational Risk Scoring (0–100 Bounded)**: Tests bounded 0–100 risk score calculations, inspectable factor breakdowns, and verifies inactive/draft placements remain baseline `LOW` risk.
25. **ML-Ready Feature Pipeline & Model Governance**: Validates point-in-time feature extraction without future data leakage and verifies sample size adequacy safeguards ($< 50$ samples triggers `EXPERIMENTAL_NOT_PRODUCTION_READY`).
26. **Data Quality Audit & IDOR Authorization Defenses**: Validates institutional data integrity scoring and verifies self-scoping authorization on personal analytics.
27. **Production Health, Readiness & Request Tracing**: Tests liveness (`/health`), readiness database ping (`/ready`), and propagation of `X-Request-ID` correlation headers.
28. **Transactional Database Backup & Safe Restoration**: Tests non-blocking SQLite snapshot generation via `VACUUM INTO` and validates header integrity during restoration.
29. **Adversarial Attack Simulation & Negative Workflow Rejection**: Tests input validation boundaries against weak passwords ($< 6$ characters), malformed email syntax, and verifies clean root status endpoints.

---

## Local Installation & Setup

### Prerequisites
- **Node.js**: v20.x or v22.x LTS installed (`node -v`)
- **npm**: v9+ installed (`npm -v`)

### 1. Clone the Repository
```bash
git clone https://github.com/AlvinMutie/Attachment-Management-System.git
cd Attachment-Management-System
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
*The backend API server will listen on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
# In a separate terminal window:
cd client
npm install
npm run dev
```
*The Vite frontend development server will launch on `http://localhost:5173`.*

### 4. Running the Automated Test Suite
```bash
cd server
npm test
# or: node test_verification.js
```

---

## Default Login Credentials

After seeding the database (`node sync.js`), the following default test accounts are available:

| Role | Email | Password | Description |
|---|---|---|---|
| **Super Admin** | `superadmin@ams.com` | `password123` | System-wide school & tenant management |
| **School Admin** | `schooladmin_a@ams.com` | `password123` | Institution admin, user management & analytics |
| **Attachment Coordinator** | `coordinator_a@ams.com` | `password123` | Placement coordination & supervisor allocation |
| **University Supervisor** | `unisup_a@ams.com` | `password123` | Academic supervision, meetings & assessments |
| **Industry Supervisor** | `supervisor_a@ams.com` | `password123` | Daily attendance & weekly logbook reviews |
| **Student** | `student_a@ams.com` | `password123` | Logbooks, attendance & placement tracking |

*Note: In production deployments, default credentials must be replaced immediately.*

---

## Production Hardening & Disaster Recovery

- **Liveness & Readiness Probes**: Built-in `/health` (process liveness) and `/ready` (database connectivity) endpoints allow seamless integration with load balancers and container orchestrators.
- **Fail-Fast Configuration**: Server startup immediately aborts if `NODE_ENV=production` and `JWT_SECRET` is missing or insecure.
- **Crash-Consistent Snapshots**: The backup utility (`server/scripts/backup.js`) utilizes SQLite `VACUUM INTO` to create non-locking, atomic database snapshots with automatic 7-day retention management.
- **Restoration Safety**: The restore utility (`server/scripts/restore.js`) verifies SQLite 3 format headers and generates a pre-restore safety snapshot before restoring the target database.
- **Process Resilience**: Full `SIGTERM` and `SIGINT` graceful shutdown handling, closing active HTTP connections and draining the Sequelize connection pool.

---

## Documentation Catalog

Detailed operational and technical documentation is maintained in the repository:
- `DEPLOYMENT_GUIDE.md`: Nginx reverse proxy, PM2 process management, SSL/TLS, and automated backup crons.
- `.ai/DEVELOPMENT.md`: Architecture overview, local setup, and design patterns.
- `.ai/TESTING.md`: Complete testing strategy and catalog of test suites.
- `.ai/SECURITY.md`: Threat model, RBAC policies, password hashing, and incident response runbook.
- `.ai/ROADMAP.md`: System maturity status and roadmap closure notice.

---

## Developer

**Alvin Mutie**  
Software Engineer  
Email: [mutiealvin0@gmail.com](mailto:mutiealvin0@gmail.com)  
GitHub: [github.com/AlvinMutie](https://github.com/AlvinMutie)

---

*Copyright 2026 AMS Project. All Rights Reserved.*
