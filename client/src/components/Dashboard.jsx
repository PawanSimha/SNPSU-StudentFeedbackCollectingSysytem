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
import axios from 'axios';

import { API } from '../config/api';

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [allotment, setAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const locked = JSON.parse(localStorage.getItem('fb_locked') || '{}');
  const lockedCount = Object.values(locked).filter(Boolean).length;

  useEffect(() => {
    axios.get(`${API}/allotments/status`).then(({ data }) => {
      setAllotment(data);
    }).catch(() => {
      setError('Unable to check feedback session status.');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h2>Welcome, {student?.name}</h2>
        <p className="subtitle">{student?.usn} | {student?.email}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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
