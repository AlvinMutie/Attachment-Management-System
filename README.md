# Attachment Management System (AMS)

The Attachment Management System (AMS) is a high-performance, multi-tenant enterprise platform designed to digitize and optimize the professional internship (attachment) lifecycle. By integrating sophisticated oversight tools with automated reporting, AMS bridges the logistical gap between academic institutions, industrial partners, and students.

## Core Capabilities

### Institutional Multi-Tenancy
Architected to support multiple independent organizations within a single deployment. Data isolation is enforced at the database level via institution-scoping, ensuring 100% cryptographic separation of institutional records.

### Advanced Presence Monitoring
A secure, real-time presence tracking system utilizing dynamic QR-based verification. This provides industrial supervisors with a tamper-proof dashboard for student oversight and attendance velocity.

### Automated Technical Reporting
Leverages specialized processing to transform daily student activity logs into formalized technical reports. The system incorporates an AI-driven refinement engine to ensure high-fidelity documentation standards.

### Administrative Command Center
Comprehensive analytics dashboards for school administrators to monitor institutional performance metrics, manage student/supervisor registries, and generate audit-ready PDF summaries.

## Technical Architecture

### Frontend Ecosystem
- **Core Framework**: React.js with Vite for optimized build performance.
- **UI Architecture**: Material 3 Design principles with customizable institutional branding.
- **State Management**: Context API for secure, centralized authentication and global session state.
- **Interactions**: Framer Motion for high-fidelity micro-animations and smooth UI transitions.

### Backend Infrastructure
- **Runtime Environment**: Node.js with Express.js.
- **ORM & Data Layer**: Sequelize ORM managing a relational MySQL database.
- **Security**: 
  - JWT-based Role-Based Access Control (RBAC).
  - Production-grade security headers via Helmet.
  - TLS-ready environment configuration.
- **Services**: Specialized engines for PDF generation (`pdfkit`) and CSV bulk data ingestion.

## Project Structure

```text
├── client/                     # Optimized React Frontend
│   ├── src/
│   │   ├── components/         # Standardized Atomic UI Components
│   │   ├── context/            # Authentication & Branding Context
│   │   ├── pages/              # Role-specific Administrative Portals
│   │   └── utils/              # Centralized API Interface (Axios)
├── server/                     # High-Performance Node.js API
│   ├── config/                 # Database & Environment Configuration
│   ├── controllers/            # Core Business Logic & Request Handlers
│   ├── middleware/             # RBAC & Security Protocols
│   ├── models/                 # Relational Data Schema Definitions
│   └── services/               # Specialized AI & Reporting Services
└── README.md                   # Technical Documentation
```

## System Deployment

### 1. Environment Configuration
Clone the repository and install dependencies in both the `/client` and `/server` directories. Configure the backend `.env` file with the following parameters:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`
- `NODE_ENV` (development/production)

### 2. Implementation & Development
To launch the development environment:
```bash
# In /server
npm run dev

# In /client
npm run dev
```

### 3. Production Build
To generate the optimized production assets:
```bash
cd client
npm run build
```

## Developer Information
**Alvin Mutie**  
Professional Software Engineer  
Email: [mutiealvin0@gmail.com](mailto:mutiealvin0@gmail.com)  

---
*Copyright © 2026 AMS Project Group. All Rights Reserved.*
