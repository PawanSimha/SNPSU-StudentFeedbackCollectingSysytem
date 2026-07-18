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
import '../styles/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import Button from './ui/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', usn: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted] = useState(() => true);
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    if (!value) return `${name === 'usn' ? 'USN' : name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
    if (name === 'usn' && value.length < 5) return 'USN is too short';
    if (name === 'password' && value.length < 4) return 'Password must be at least 4 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

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
    <main className="login-page" role="main">
      <div className="login-bg">
        <div className="login-orb login-orb--1" />
        <div className="login-orb login-orb--2" />
        <div className="login-orb login-orb--3" />
      </div>

      <div className={`login-card ${mounted ? 'login-card--visible' : ''}`}>
        <div className="login-card__inner">
          <div className="login-card__header">
            <img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" loading="lazy" className="login-card__logo" />
            <h1 className="login-card__title">Feedback Collector</h1>
          </div>

          {error && <div className="login-card__error">{error}</div>}

          <form className="login-card__form" onSubmit={handleSubmit} noValidate>
            <div className="login-card__field">
              <label htmlFor="email">Email</label>
              <div className="login-card__input-wrap">
                <Mail size={16} className="login-card__input-icon" />
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required placeholder="Student@gmail.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
              </div>
              {errors.email && <p className="field-error" id="email-error" role="alert">{errors.email}</p>}
            </div>

            <div className="login-card__field">
              <label htmlFor="usn">USN</label>
              <div className="login-card__input-wrap">
                <User size={16} className="login-card__input-icon" />
                <input id="usn" type="text" name="usn" value={form.usn} onChange={handleChange} onBlur={handleBlur} required placeholder="25SUPMCAGL000" aria-invalid={!!errors.usn} aria-describedby={errors.usn ? 'usn-error' : undefined} />
              </div>
              {errors.usn && <p className="field-error" id="usn-error" role="alert">{errors.usn}</p>}
            </div>

            <div className="login-card__field">
              <label htmlFor="password">Password</label>
              <div className="login-card__input-wrap">
                <Lock size={16} className="login-card__input-icon" />
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} required placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} />
                <button type="button" className="login-card__eye" onClick={() => setShowPassword((p) => !p)} tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="field-error" id="password-error" role="alert">{errors.password}</p>}
            </div>

            <Button type="submit" loading={submitting} disabled={submitting} size="lg" style={{ width: '100%' }}>
              Sign In
            </Button>
          </form>

          <Button type="button" variant="ghost" onClick={() => navigate('/')} style={{ margin: '24px auto 0', display: 'block' }}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Login;
