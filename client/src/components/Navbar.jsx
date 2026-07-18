import '../styles/Navbar.css';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, MessageSquare, Users, Database, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  landing: [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'University', href: 'https://snpsu.edu.in/engineering/', external: true },
  ],
  student: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Feedback', href: '/my-feedback', icon: MessageSquare },
  ],
  admin: [
    { label: 'Classes', href: '/admin', icon: Users },
    { label: 'Allot', href: '/admin/allotments', icon: Database },
    { label: 'Anonymous', href: '/admin/anonymous', icon: Eye },
    { label: 'Database', href: '/admin/database', icon: Database },
  ],
};

const Navbar = ({ variant = 'solid' }) => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = variant === 'landing';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = useCallback((e, item) => {
    if (item.external) return;
    if (item.href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getItems = () => {
    if (isLanding) return NAV_ITEMS.landing;
    if (!student) return [];
    return student.role === 'admin' ? NAV_ITEMS.admin : NAV_ITEMS.student;
  };

  const items = getItems();
  const navClass = [
    'navbar',
    isLanding ? 'navbar--landing' : 'navbar--solid',
    scrolled ? 'navbar--scrolled' : '',
    mobileOpen ? 'navbar--mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <Link to={isLanding ? '/' : (student?.role === 'admin' ? '/admin' : '/dashboard')} className="navbar__brand" aria-label="Home">
          <img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" className="navbar__logo" />
        </Link>

        <div className="navbar__right">
          <ul className="navbar__links" role="menubar">
            {items.map((item) => (
              <li key={item.label} role="none">
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="navbar__link" role="menuitem">
                    {item.label}
                  </a>
                ) : item.href.startsWith('#') ? (
                  <a href={item.href} onClick={(e) => handleNavClick(e, item)} className="navbar__link" role="menuitem">
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.href} className={`navbar__link${location.pathname === item.href ? ' navbar__link--active' : ''}`} role="menuitem">
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            {isLanding ? (
              <Link to="/login" className="navbar__cta">Sign In</Link>
            ) : student ? (
              <button onClick={handleLogout} className="navbar__logout" aria-label="Logout">
                <LogOut size={16} />
                <span className="navbar__logout-label">Logout</span>
              </button>
            ) : null}
          </div>

          <button
            className="navbar__toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="navbar__drawer-links">
              {items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="navbar__drawer-link" onClick={() => setMobileOpen(false)}>
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </a>
                  ) : item.href.startsWith('#') ? (
                    <a href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(e, item); }} className="navbar__drawer-link">
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.href} className={`navbar__drawer-link${location.pathname === item.href ? ' navbar__drawer-link--active' : ''}`} onClick={() => setMobileOpen(false)}>
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="navbar__drawer-footer">
              {isLanding ? (
                <Link to="/login" className="navbar__drawer-cta" onClick={() => setMobileOpen(false)}>Sign In</Link>
              ) : student ? (
                <button onClick={handleLogout} className="navbar__drawer-logout">
                  <LogOut size={18} /> Logout
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
