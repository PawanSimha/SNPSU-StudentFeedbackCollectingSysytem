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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  usn: z.string().min(5, 'USN must be at least 5 characters').max(20, 'USN is too long'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting, dirtyFields } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', usn: '', password: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data.email, data.usn, data.password);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <main className="lg" role="main">
      <div className="lg-bg" />
      <div className="lg-overlay" />

      <motion.div
        className="lg-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lg-card__inner">
          {/* Logo & Header */}
          <div className="lg-header">
            <img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" loading="lazy" className="lg-header__logo" />
            <h1 className="lg-header__title">Feedback Collector</h1>
            <p className="lg-header__desc">Sign in to access the Student Feedback Collection System</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div className="lg-error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert">
              {serverError}
            </motion.div>
          )}

          {/* Form */}
          <form className="lg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="lg-field">
              <label className="lg-field__label" htmlFor="email">Email</label>
              <div className={`lg-input ${errors.email ? 'is-error' : dirtyFields.email && !errors.email ? 'is-valid' : ''}`}>
                <Mail size={16} className="lg-input__icon" />
                <input
                  id="email"
                  type="email"
                  className="lg-input__field"
                  placeholder="student@snpsu.edu.in"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="lg-field__error" id="email-error" role="alert">{errors.email.message}</p>}
            </div>

            {/* USN */}
            <div className="lg-field">
              <label className="lg-field__label" htmlFor="usn">USN</label>
              <div className={`lg-input ${errors.usn ? 'is-error' : dirtyFields.usn && !errors.usn ? 'is-valid' : ''}`}>
                <User size={16} className="lg-input__icon" />
                <input
                  id="usn"
                  type="text"
                  className="lg-input__field"
                  placeholder="25SUPMCAGL000"
                  aria-invalid={!!errors.usn}
                  aria-describedby={errors.usn ? 'usn-error' : undefined}
                  {...register('usn')}
                />
              </div>
              {errors.usn && <p className="lg-field__error" id="usn-error" role="alert">{errors.usn.message}</p>}
            </div>

            {/* Password */}
            <div className="lg-field">
              <div className="lg-field__label-row">
                <label className="lg-field__label" htmlFor="password">Password</label>
                <button type="button" className="lg-field__forgot" tabIndex={-1} disabled>Forgot?</button>
              </div>
              <div className={`lg-input ${errors.password ? 'is-error' : dirtyFields.password && !errors.password ? 'is-valid' : ''}`}>
                <Lock size={16} className="lg-input__icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="lg-input__field"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="lg-input__eye"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="lg-field__error" id="password-error" role="alert">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="lg-submit"
              disabled={isSubmitting}
              aria-label="Sign in to your account"
            >
              {isSubmitting ? (
                <span className="lg-submit__loading"><Loader2 size={18} className="lg-submit__spinner" /> Signing In...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="lg-security">
            <ShieldCheck size={13} />
            <span>Secure authentication &middot; Encrypted connection &middot; Authorized access only</span>
          </div>

          {/* Back */}
          <button type="button" className="lg-back" onClick={() => navigate('/')}>
            <ArrowLeft size={15} /> Back to Home
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
