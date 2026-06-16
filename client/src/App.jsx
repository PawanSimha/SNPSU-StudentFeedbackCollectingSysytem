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
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import MyFeedback from './components/MyFeedback';
import AdminClassSelect from './components/AdminClassSelect';
import AdminStudents from './components/AdminStudents';
import AdminStudentFeedback from './components/AdminStudentFeedback';
import AdminAllotments from './components/AdminAllotments';
import AdminDbOverview from './components/AdminDbOverview';
import AdminAnonymous from './components/AdminAnonymous';
import PublicFeedback from './components/PublicFeedback';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

const ProtectedRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return student ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { student, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (student) {
    return student.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  return children;
};

const ProtectedLayout = () => (
  <>
    <Navbar />
    <main className="container">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => (
  <AuthProvider>
    <Routes>
      {/* Public pages: no navbar/footer */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/feedback/public" element={<PublicFeedback />} />

      {/* Authenticated pages: with navbar/footer */}
      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/my-feedback" element={<MyFeedback />} />
        <Route path="/admin" element={<AdminClassSelect />} />
        <Route path="/admin/allotments" element={<AdminAllotments />} />
        <Route path="/admin/database" element={<AdminDbOverview />} />
        <Route path="/admin/anonymous" element={<AdminAnonymous />} />
        <Route path="/admin/:classGroup" element={<AdminStudents />} />
        <Route path="/admin/:classGroup/student/:studentId" element={<AdminStudentFeedback />} />
      </Route>

      {/* 404: no navbar/footer */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <CookieConsent />
  </AuthProvider>
);

export default App;