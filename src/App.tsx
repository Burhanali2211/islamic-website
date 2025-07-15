import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnimatePresence } from 'framer-motion';

// Layouts
import { PublicLayout } from './components/PublicLayout';
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// UI Components
import { AnimatedBackground } from './components/ui/AnimatedBackground';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

// Lazy load public pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Library = React.lazy(() => import('./pages/Library').then(module => ({ default: module.Library })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Foundation = React.lazy(() => import('./pages/Foundation').then(module => ({ default: module.Foundation })));
const LearningCenter = React.lazy(() => import('./pages/LearningCenter').then(module => ({ default: module.LearningCenter })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Lazy load student pages
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const StudyPlans = React.lazy(() => import('./pages/StudyPlans').then(module => ({ default: module.StudyPlans })));
const Progress = React.lazy(() => import('./pages/Progress').then(module => ({ default: module.Progress })));
const Notes = React.lazy(() => import('./pages/Notes').then(module => ({ default: module.Notes })));
const StudyGroups = React.lazy(() => import('./pages/StudyGroups').then(module => ({ default: module.StudyGroups })));
const Quizzes = React.lazy(() => import('./pages/Quizzes').then(module => ({ default: module.Quizzes })));
const ReadingHistory = React.lazy(() => import('./pages/ReadingHistory').then(module => ({ default: module.ReadingHistory })));

// Lazy load shared dashboard pages
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

// Lazy load teacher pages
const TeacherDashboard = React.lazy(() => import('./pages/teacher/TeacherDashboard').then(module => ({ default: module.TeacherDashboard })));
const ManageCourses = React.lazy(() => import('./pages/teacher/ManageCourses').then(module => ({ default: module.ManageCourses })));
const ManageStudents = React.lazy(() => import('./pages/teacher/ManageStudents').then(module => ({ default: module.ManageStudents })));
const GradingCenter = React.lazy(() => import('./pages/teacher/GradingCenter').then(module => ({ default: module.GradingCenter })));

// Lazy load admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ManageBooks = React.lazy(() => import('./pages/admin/ManageBooks').then(module => ({ default: module.ManageBooks })));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers').then(module => ({ default: module.ManageUsers })));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/learning-center" element={<LearningCenter />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['user']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/study-plans" element={<ProtectedRoute allowedRoles={['user']}><StudyPlans /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute allowedRoles={['user']}><Progress /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute allowedRoles={['user']}><Notes /></ProtectedRoute>} />
          <Route path="/study-groups" element={<ProtectedRoute allowedRoles={['user']}><StudyGroups /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute allowedRoles={['user']}><Quizzes /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><ReadingHistory /></ProtectedRoute>} />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/courses" element={<ProtectedRoute allowedRoles={['teacher']}><ManageCourses /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><ManageStudents /></ProtectedRoute>} />
          <Route path="/teacher/grading" element={<ProtectedRoute allowedRoles={['teacher']}><GradingCenter /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute allowedRoles={['admin']}><ManageBooks /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />

          {/* Shared Profile Route */}
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user', 'teacher', 'admin']}><Profile /></ProtectedRoute>} />
        </Route>
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans">
          <AnimatedBackground />
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedRoutes />
          </Suspense>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
