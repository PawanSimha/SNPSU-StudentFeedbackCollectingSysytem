import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [allotment, setAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const locked = JSON.parse(localStorage.getItem('fb_locked') || '{}');
  const lockedCount = Object.values(locked).filter(Boolean).length;

  useEffect(() => {
    axios.get(`${API}/allotments/status`).then(({ data }) => {
      setAllotment(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h2>Welcome, {student?.name}</h2>
        <p className="subtitle">{student?.usn} | {student?.email}</p>
      </div>

      {loading ? (
        <p className="loading-text">Checking feedback session...</p>
      ) : allotment?.open ? (
        <div className="allotment-block">
          <div className="allotment-badge">Feedback Session Active</div>
          <p className="allotment-msg">{allotment.message}</p>
          <button className="btn btn-start-feedback" onClick={() => navigate('/feedback')}>
            {lockedCount > 0 ? 'Continue Feedback →' : 'Give Feedback →'}
          </button>
        </div>
      ) : (
        <div className="no-session">
          <p>No feedback session is currently open for your class.</p>
          <p className="subtitle">Please wait for the admin to open a session.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
