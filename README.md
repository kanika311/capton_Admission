# CaptonAdmission – Modern Education Admission & University Discovery Platform

**CaptonAdmission** is an education admission, course discovery, and university comparison platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It empowers students to explore courses across streams, evaluate verified university fees and placements, receive personalized academic counselling, and track their admission pipeline in real time.

---

## 1. Key Platform Features

- **Public Website & Conversion Landing Page**: Modern, high-conversion landing page presenting course streams, featured degrees, top NIRF-ranked institutions, entrance examination guides, and verified student reviews.
- **Three-Panel Course Discovery Engine (`/courses`)**:
  - *Exclusively on `/courses` (never cluttered on the homepage)*.
  - **Panel 1 (Select Course)**: Category filtering (14 streams), course levels (Undergraduate, Postgraduate, Diploma), keyword search, and specialization selectors.
  - **Panel 2 (Explore Matching Universities)**: Dynamically displays accredited colleges offering the selected degree, complete with verified tuition fees, city/state filters, sorting, and admission statuses.
  - **Panel 3 (My Selection)**: Live selection summary, shortlist counter, side-by-side comparison drawer, and instant enquiry form triggers.
- **Side-by-Side University Comparison (`/compare`)**: Compare up to 4 universities simultaneously across total fees, average/highest placement packages, accreditations, eligibility, and admission modes.
- **Student Authentication & Portal (`/student/dashboard`)**:
  - Secure JWT authentication with HTTP-only cookies and Bearer tokens.
  - Profile readiness tracker and academic qualification record (10th, 12th, graduation).
  - Document Vault: Upload and manage Class 10/12 marksheets, identity proofs, and photographs.
  - Real-Time Application Timeline: Track statuses from `Submitted` &rarr; `Under Review` &rarr; `Counselling Scheduled` &rarr; `Approved` &rarr; `Admission Confirmed`.
  - Notifications & counsellor remark feeds.
- **Admin Management Console (`/admin/dashboard`)**:
  - Live aggregated analytics charts powered by Recharts (monthly admission volume, application status distribution, lead conversion metrics).
  - Complete Course Catalog CRUD with specialization management.
  - University Directory CRUD with placement packages, NIRF accreditations, and cover media.
  - **Course-University Mapping Engine**: Associate courses with universities, customize total fees, set application fees, configure admission mode (Online/Offline/Hybrid), and update admission availability.
  - Admissions pipeline manager: update application statuses, assign designated counsellors, and record internal notes.
  - Lead Management: Filter inquiries by status (`New`, `Contacted`, `Interested`, `Converted`), schedule follow-ups, and track counsellor performance.
  - Student Directory: Account activation and suspension toggles.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite 5
- **Routing**: React Router DOM v6
- **State Management**: Redux Toolkit + React-Redux
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js v24+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM *(features automatic embedded in-memory database fallback for zero-configuration local evaluation)*
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs password hashing + Cookie Parser
- **File Uploads**: Multer with file type & size limits
- **Security**: Helmet, Express Rate Limit, CORS, MongoDB injection protection
- **Logging & Emails**: Morgan, Nodemailer

---

## 3. Brand Identity & Design System

| Role | Color Name | Hex Code |
|---|---|---|
| Primary Brand Color | Royal Blue | `#1746A2` |
| Secondary Dark Brand | Deep Navy | `#102B59` |
| CTA & Accent Color | Gold | `#E5A900` |
| Page Background | Light Background | `#F5F7FC` |
| Body Text | Dark Charcoal | `#202A3A` |
| Borders & Dividers | Soft Slate | `#E5EAF2` |

---

## 4. Single-Root Repository Structure

```text
captonadmission/
├── client/                      # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   │   ├── logo.png             # CaptonAdmission Circular Logo
│   │   ├── favicon.ico
│   │   └── images/
│   ├── src/
│   │   ├── components/          # Reusable UI & Discovery Panels
│   │   │   ├── common/          # Navbar, Footer, EnquiryModal, ProtectedRoute
│   │   │   └── courseDiscovery/ # PanelCourseSelect, PanelUniversityList, PanelMySelection
│   │   ├── layouts/             # PublicLayout, StudentLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/          # HomePage, CoursesPage, UniversitiesPage, ServicesPage, etc.
│   │   │   ├── student/         # StudentDashboard, Profile, Applications, Documents
│   │   │   └── admin/           # Analytics, Courses, Universities, Mappings, Leads
│   │   ├── redux/               # Redux Toolkit store & slices
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx              # Application Route Registry
│   │   ├── index.css            # Tailwind directives
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Backend API (Node.js + Express + Mongoose)
│   ├── config/                  # MongoDB connection & fallback
│   ├── controllers/             # Auth, Course, University, Application, Admin
│   ├── middleware/              # JWT protect, authorize, upload, errorHandler
│   ├── models/                  # 22 Mongoose Models (User, Course, University, etc.)
│   ├── routes/                  # Express REST API routes
│   ├── services/                # Nodemailer email & Activity Logger
│   ├── utils/                   # seed.js (Comprehensive demo dataset)
│   ├── uploads/                 # Static uploads folder
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entrypoint
│   └── package.json
│
├── package.json                 # Root script runner (concurrently)
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
From the root directory, install all dependencies for root, server, and client:
```bash
npm run install:all
```

### Seeding Demo Data
To populate the database with 14 Course Categories, 30 Courses, 20 Verified Universities, Mappings, 10 Entrance Exams, 12 Services, 10 Blogs, Testimonials, FAQs, and Sample Applications:
```bash
npm run seed
```

### Running Development Servers
Run frontend and backend simultaneously in one terminal window:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **API Health Check**: `http://localhost:5000/api/health`

### Production Build
```bash
npm run build
npm start
```

---

## 6. Pre-Configured Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@captonadmission.com` | `Admin@12345` | Full administrative access to courses, universities, applications, analytics, and leads |
| **Counsellor** | `counsellor@captonadmission.com` | `Counsellor@12345` | Application management, lead follow-ups, and student remark updates |
| **Student** | `student@captonadmission.com` | `Student@12345` | Student dashboard, document vault, shortlists, and application tracking |

*You can also register any new student account directly from the frontend registration page.*

---

## 7. Key REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student account
- `POST /api/auth/login` - Authenticate user & issue JWT
- `POST /api/auth/logout` - Clear authentication token
- `GET /api/auth/me` - Fetch authenticated user profile

### Courses & Categories
- `GET /api/courses` - Search and filter courses (query: `category`, `level`, `search`, `featured`)
- `GET /api/courses/slug/:slug` - Course details with offering universities
- `GET /api/course-categories` - List 14 course categories
- `POST /api/courses` *(Admin)* - Create new course

### Universities & Mapping
- `GET /api/universities` - University directory (query: `state`, `universityType`, `search`, `sort`)
- `GET /api/universities/slug/:slug` - Full university profile with courses & fees
- `GET /api/course-universities` - **Three-Panel Matching Engine** (query: `courseId`, `specialization`, `state`, `admissionStatus`, `sort`)
- `POST /api/course-universities` *(Admin)* - Map course to university with fees and admission mode

### Student & Applications
- `GET /api/students/profile` - Student profile & marks
- `PUT /api/students/profile` - Update demographics & address
- `PUT /api/students/education` - Update 10th, 12th, and graduation marks
- `POST /api/students/documents` - Upload marksheets or ID proof (Multer)
- `POST /api/applications` - Submit university admission application
- `GET /api/applications` - List applications (role-filtered)
- `PUT /api/applications/:id/status` *(Admin/Counsellor)* - Update pipeline status
- `POST /api/enquiries` - Public admission enquiry submission

---

## 8. License & Ownership
Copyright &copy; 2026 **CaptonAdmission**. All rights reserved.
