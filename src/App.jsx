import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import CoursesPage from './pages/public/CoursesPage';
import CourseDetailsPage from './pages/public/CourseDetailsPage';
import UniversitiesPage from './pages/public/UniversitiesPage';
import UniversityDetailsPage from './pages/public/UniversityDetailsPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailsPage from './pages/public/ServiceDetailsPage';
import ExamsPage from './pages/public/ExamsPage';
import ExamDetailsPage from './pages/public/ExamDetailsPage';
import ComparePage from './pages/public/ComparePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import BlogsPage from './pages/public/BlogsPage';
import BlogDetailsPage from './pages/public/BlogDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AdminLoginPage from './pages/public/AdminLoginPage';

// Student Pages
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentDocumentsPage from './pages/student/StudentDocumentsPage';
import StudentShortlistsPage from './pages/student/StudentShortlistsPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';

// Admin Pages
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminCMSPage from './pages/admin/AdminCMSPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';
import AdminMappingsPage from './pages/admin/AdminMappingsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCounsellorsPage from './pages/admin/AdminCounsellorsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token, dispatch]);

  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/universities/:slug" element={<UniversityDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/:slug" element={<ExamDetailsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Public disguise: /admin/login redirects to home for security */}
        <Route path="/admin/login" element={<Navigate to="/" replace />} />
      </Route>

      {/* Standalone Secret Administrator Access Portal (Isolated from website) */}
      <Route path="/capton-admin" element={<AdminLoginPage />} />
      <Route path="/capton-admin/login" element={<AdminLoginPage />} />

      {/* Student Protected Portal */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="applications" element={<StudentApplicationsPage />} />
        <Route path="documents" element={<StudentDocumentsPage />} />
        <Route path="shortlists" element={<StudentShortlistsPage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
      </Route>

      {/* Admin Protected Portal */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'superadmin', 'counsellor']}>
            <AdminLayout />
          </RoleBasedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="cms" element={<AdminCMSPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="universities" element={<AdminUniversitiesPage />} />
        <Route path="mappings" element={<AdminMappingsPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="counsellors" element={<AdminCounsellorsPage />} />
        <Route path="admins" element={<AdminUsersPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
