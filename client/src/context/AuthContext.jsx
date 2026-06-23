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
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { API } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await axios.get(`${API}/auth/me`);
          sessionStorage.setItem('student', JSON.stringify(data));
          setStudent(data);
        } catch {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('student');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, usn, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, usn, password });
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('student', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setStudent(data);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('student');
    localStorage.removeItem('fb_locked');
    localStorage.removeItem('fb_drafts');
    localStorage.removeItem('fb_ratings');
    delete axios.defaults.headers.common['Authorization'];
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
