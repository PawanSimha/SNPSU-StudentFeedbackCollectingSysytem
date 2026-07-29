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
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiClient } from '../config/api';

const setAuthHeader = (token) => {
  const bearer = `Bearer ${token}`;
  apiClient.defaults.headers.common['Authorization'] = bearer;
  axios.defaults.headers.common['Authorization'] = bearer;
};

const clearAuthHeader = () => {
  delete apiClient.defaults.headers.common['Authorization'];
  delete axios.defaults.headers.common['Authorization'];
};

const AuthContext = createContext(null);

const tryRefresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken });
    sessionStorage.setItem('token', data.token);
    setAuthHeader(data.token);
    return true;
  } catch {
    localStorage.removeItem('refreshToken');
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      let token = sessionStorage.getItem('token');
      if (!token) {
        const refreshed = await tryRefresh();
        if (refreshed) token = sessionStorage.getItem('token');
      }
      if (token) {
        setAuthHeader(token);
        try {
          const { data } = await apiClient.get('/auth/me');
          sessionStorage.setItem('student', JSON.stringify(data));
          setStudent(data);
        } catch {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('student');
          clearAuthHeader();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, usn, password) => {
    const { data } = await apiClient.post('/auth/login', { email, usn, password });
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('student', JSON.stringify(data));
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    setAuthHeader(data.token);
    setStudent(data);
    return data;
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('student');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('fb_locked');
    localStorage.removeItem('fb_drafts');
    clearAuthHeader();
    setStudent(null);
  }, []);

  return (
    <AuthContext.Provider value={{ student, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
