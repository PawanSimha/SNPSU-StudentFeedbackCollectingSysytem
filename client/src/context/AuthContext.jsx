import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

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
