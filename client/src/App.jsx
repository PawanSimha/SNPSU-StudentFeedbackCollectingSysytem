/*
  SOAS Feedback Collector - Anonymous course feedback platform for Sapthagiri NPS University
  Copyright (C) 2026 Pawan Simha R

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ui/Toast';
import './components/ui/ui.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const Landing = lazy(() => import('./components/Landing'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const MyFeedback = lazy(() => import('./components/MyFeedback'));
const AdminClassSelect = lazy(() => import('./components/AdminClassSelect'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminStudents = lazy(() => import('./components/AdminStudents'));
const AdminStudentFeedback = lazy(() => import('./components/AdminStudentFeedback'));
const AdminAllotments = lazy(() => import('./components/AdminAllotments'));
const AdminDbOverview = lazy(() => import('./components/AdminDbOverview'));
const AdminAnonymous = lazy(() => import('./components/AdminAnonymous'));
const PublicFeedback = lazy(() => import('./components/PublicFeedback'));
const NotFound = lazy(() => import('./components/NotFound'));

const Loading = () => <div className="loading">Loading...</div>;

const ProtectedRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return <Loading />;
  return student ? children : <Navigate to="/" />;
};

const AdminRoute = () => {
  const { student, loading } = useAuth();
  if (loading) return <Loading />;
  if (!student) return <Navigate to="/" />;
  if (student.role !== 'admin') return <Navigate to="/dashboard" />;
  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return <Loading />;
  if (student) {
    return student.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  return children;
};

const ProtectedLayout = () => {
  const loc = useLocation();
  return (
    <>
    <Navbar variant="solid" key={loc.pathname} />
    <main className="container" id="main-content">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/feedback/public" element={<PublicFeedback />} />

            {/* Authenticated pages: with navbar/footer */}
            <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/my-feedback" element={<MyFeedback />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminClassSelect />} />
                <Route path="/admin/:classGroup/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/allotments" element={<AdminAllotments />} />
                <Route path="/admin/database" element={<AdminDbOverview />} />
                <Route path="/admin/anonymous" element={<AdminAnonymous />} />
                <Route path="/admin/:classGroup" element={<AdminStudents />} />
                <Route path="/admin/:classGroup/student/:studentId" element={<AdminStudentFeedback />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieConsent />
        <ToastProvider />
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;