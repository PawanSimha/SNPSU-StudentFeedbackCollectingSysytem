import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

const App = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/feedback/public';

  return (
      <AuthProvider>
        {!isPublicPage && <Navbar />}
        <main className="container" style={isPublicPage ? { padding: 0, maxWidth: 'none', minHeight: 'unset' } : {}}>
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/feedback/public" element={<PublicFeedback />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackForm /></ProtectedRoute>} />
            <Route path="/my-feedback" element={<ProtectedRoute><MyFeedback /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminClassSelect /></ProtectedRoute>} />
            <Route path="/admin/allotments" element={<ProtectedRoute><AdminAllotments /></ProtectedRoute>} />
            <Route path="/admin/database" element={<ProtectedRoute><AdminDbOverview /></ProtectedRoute>} />
            <Route path="/admin/anonymous" element={<ProtectedRoute><AdminAnonymous /></ProtectedRoute>} />
            <Route path="/admin/:classGroup" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/:classGroup/student/:studentId" element={<ProtectedRoute><AdminStudentFeedback /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {!isPublicPage && <Footer />}
      </AuthProvider>
  );
};

export default App;
