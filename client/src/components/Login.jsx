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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', usn: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.usn, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb--1" />
        <div className="login-orb login-orb--2" />
        <div className="login-orb login-orb--3" />
      </div>

      <div className={`login-card ${mounted ? 'login-card--visible' : ''}`}>
        <div className="login-card__inner">
          <div className="login-card__header">
            <img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" className="login-card__logo" />
            <h1 className="login-card__title">Feedback Collector</h1>
          </div>

          {error && <div className="login-card__error">{error}</div>}

          <form className="login-card__form" onSubmit={handleSubmit}>
            <div className="login-card__field">
              <label htmlFor="email">Email</label>
              <div className="login-card__input-wrap">
                <svg className="login-card__input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4L8 8.5L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Student@gmail.com" />
              </div>
            </div>

            <div className="login-card__field">
              <label htmlFor="usn">USN</label>
              <div className="login-card__input-wrap">
                <svg className="login-card__input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 14.5C2 11.5 4.5 9 8 9C11.5 9 14 11.5 14 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input id="usn" type="text" name="usn" value={form.usn} onChange={handleChange} required placeholder="25SUPMCAGL000" />
              </div>
            </div>

            <div className="login-card__field">
              <label htmlFor="password">Password</label>
              <div className="login-card__input-wrap">
                <svg className="login-card__input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2.5" y="6.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 6.5V4.5C5 3 6 2 8 2C10 2 11 3 11 4.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
                </svg>
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" />
                <button type="button" className="login-card__eye" onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 9C2 9 4.5 4 9 4C13.5 4 16 9 16 9C16 9 13.5 14 9 14C4.5 14 2 9 2 9Z" stroke="currentColor" strokeWidth="1.4"/>
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M13 5L5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 9C2 9 4.5 4 9 4C13.5 4 16 9 16 9C16 9 13.5 14 9 14C4.5 14 2 9 2 9Z" stroke="currentColor" strokeWidth="1.4"/>
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-card__submit" disabled={submitting}>
              {submitting ? (
                <span className="login-card__submit-loading">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="8"/>
                  </svg>
                  Signing in&hellip;
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <button type="button" className="login-card__back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
