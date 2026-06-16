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
        <Link to={student.role === 'admin' ? '/admin' : '/dashboard'} className="nav-brand"><img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" className="nav-logo" /></Link>
        {student.role === 'admin' && <span className="nav-badge admin-badge">Admin</span>}
      </div>
      <div className="nav-links">
        {student.role === 'admin' ? (
          <>
            <Link to="/admin">Classes</Link>
            <Link to="/admin/allotments">Allot</Link>
            <Link to="/admin/anonymous">Anonymous</Link>
            <Link to="/admin/database">Database</Link>
            <button onClick={handleLogout} className="btn-logout" aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-feedback">My Feedback</Link>
            <button onClick={handleLogout} className="btn-logout" aria-label="Logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
