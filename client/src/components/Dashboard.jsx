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
import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ClipboardList, BookOpen, MessageSquare } from 'lucide-react';

import Button from './ui/Button';
import { API } from '../config/api';

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [allotment, setAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let locked;
  try { locked = JSON.parse(localStorage.getItem('fb_locked') || '{}'); } catch { locked = {}; }
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
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="loading-text">Checking feedback session...</p>
      ) : (
        <>
          <div className="dashboard-top">
            <div className="dashboard-main">
              <div className="dashboard-main__header">
                <h2>Welcome, {student?.name}</h2>
                <p className="dashboard-main__meta">{student?.usn} &middot; {student?.email}</p>
              </div>

              {allotment?.open ? (
                <div className="session-card">
                  <div className="session-card__header">
                    <span className="session-card__dot"></span>
                    <span>Feedback Session Active</span>
                  </div>
                  <div className="session-card__body">
                    <p className="session-card__message">{allotment.message}</p>
                  </div>
                </div>
              ) : (
                <div className="no-session-card">
                  <div className="no-session-card__icon"><ClipboardList size={32} /></div>
                  <h3 className="no-session-card__title">No Active Feedback Session</h3>
                  <p className="no-session-card__desc">
                    Feedback sessions are opened by your administrator after each class or assessment.
                    Check back later to submit your responses.
                  </p>
                </div>
              )}
            </div>

            <div className="dashboard-side">
              <div className="info-list">
                <div className="info-list__item">
                  <span className="info-list__icon"><BookOpen size={20} /></span>
                  <div className="info-list__text">
                    <span className="info-list__value">6</span>
                    <span className="info-list__label">Subjects to Review</span>
                  </div>
                </div>
                <div className="info-list__item">
                  <span className="info-list__icon"><MessageSquare size={20} /></span>
                  <div className="info-list__text">
                    <span className="info-list__value">50–300</span>
                    <span className="info-list__label">Characters per Comment</span>
                  </div>
                </div>
              </div>

              {allotment?.open && (
                <Button variant="primary" size="lg" onClick={() => navigate('/feedback')}>
                  {lockedCount > 0 ? 'Continue Feedback →' : 'Give Feedback →'}
                </Button>
              )}
            </div>
          </div>

          <div className="dashboard-bottom">
            <div className="dashboard-section">
              <h3 className="dashboard-section__title">How Feedback Works</h3>
              <ol className="steps-list">
                <li><strong>Write your comments</strong> - Share your thoughts (50–300 characters per subject). Be specific about what worked well and what could be improved.</li>
                <li><strong>Lock your response</strong> - Each subject's feedback is locked individually. You can unlock and edit before final submission.</li>
                <li><strong>Submit all at once</strong> - Once all subjects are locked, review your responses and submit everything together.</li>
              </ol>
            </div>
            <div className="dashboard-section">
              <h3 className="dashboard-section__title">Guidelines</h3>
              <ul className="guidelines-list">
                <li>Your honest feedback directly helps improve the quality of teaching and course delivery.</li>
                <li>Be constructive - mention specific aspects that worked well or areas that need improvement.</li>
                <li>All responses are aggregated - your identity is never revealed to faculty in individual reports.</li>
                <li>This is your voice - use it genuinely to make a difference for future sessions.</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
