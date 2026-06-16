import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!student) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand-group">
        <Link to={student.role === 'admin' ? '/admin' : '/dashboard'} className="nav-brand"><img src="/images/navbar-logo.webp" alt="SOAS" className="nav-logo" /></Link>
        {student.role === 'admin' && <span className="nav-badge admin-badge">Admin</span>}
      </div>
      <div className="nav-links">
        {student.role === 'admin' ? (
          <>
            <Link to="/admin">Classes</Link>
            <Link to="/admin/allotments">Allot</Link>
            <Link to="/admin/anonymous">Anonymous</Link>
            <Link to="/admin/database">Database</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-feedback">My Feedback</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
