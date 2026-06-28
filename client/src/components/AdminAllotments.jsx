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
import '../styles/AdminAllotments.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { API } from '../config/api';
const MSG_MIN = 15;
const MSG_MAX = 50;

const sectionLabels = {
  'MCA, 1st Year, 2nd Sem, A sec': 'A Section',
  'MCA, 1st Year, 2nd Sem, B sec': 'B Section',
  'MCA, 1st Year, 2nd Sem, C sec': 'C Section',
};

const AdminAllotments = () => {
  const [classList, setClassList] = useState([]);
  const [allotments, setAllotments] = useState({});
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/admin/classes`).then(({ data }) => setClassList(data)).catch(() => {});
    axios.get(`${API}/allotments`).then(({ data }) => {
      const map = {};
      const msgs = {};
      data.forEach(a => {
        map[a.classGroup] = a;
        msgs[a.classGroup] = a.message || '';
      });
      setAllotments(map);
      setMessages(msgs);
    }).catch(() => setPageError('Failed to load allotments')).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (classGroup) => {
    const msg = (messages[classGroup] || '').trim();
    const current = allotments[classGroup];

    if (!current || !current.isOpen) {
      if (msg.length < MSG_MIN) {
        setErrors({ ...errors, [classGroup]: `Message min ${MSG_MIN} characters (${msg.length}/${MSG_MIN})` });
        return;
      }
      if (msg.length > MSG_MAX) {
        setErrors({ ...errors, [classGroup]: `Message max ${MSG_MAX} characters (${msg.length}/${MSG_MAX})` });
        return;
      }
    }

    setErrors({ ...errors, [classGroup]: '' });

    try {
      const { data } = await axios.post(`${API}/allotments`, { classGroup, message: msg });
      setAllotments({ ...allotments, [classGroup]: data });
      if (data.isOpen) {
        setMessages({ ...messages, [classGroup]: data.message });
      }
    } catch (err) {
      setErrors({ ...errors, [classGroup]: err.response?.data?.message || 'Failed to toggle' });
    }
  };

  return (
    <div className="admin-allotments">
      <h2>Allot Feedback Sessions</h2>
      <p className="subtitle">Open or close feedback for each class</p>

      {pageError && <div className="alert alert-error">{pageError}</div>}

      {loading ? (
        <p className="loading-text">Loading allotments...</p>
      ) : (
      <div className="allotment-list">
        {classList.map((cls) => {
          const state = allotments[cls];
          const isOpen = state?.isOpen || false;
          const msg = messages[cls] || '';
          const err = errors[cls] || '';

          return (
            <div key={cls} className={`allotment-card ${isOpen ? 'open' : 'closed'}`}>
              <div className="allotment-card-header">
                <span className="class-badge">MCA</span>
                <span className="class-section">{sectionLabels[cls] || cls}</span>
                <span className={`allot-status ${isOpen ? 'open' : 'closed'}`}>
                  {isOpen ? '● Open' : '○ Closed'}
                </span>
              </div>
              <p className="allotment-class-name">{cls}</p>

              <div className="allotment-message-group">
                <label>Session Message (optional, {MSG_MIN}-{MSG_MAX} chars):</label>
                <input
                  type="text"
                  className="allotment-input"
                  value={msg}
                  onChange={(e) => setMessages({ ...messages, [cls]: e.target.value })}
                  maxLength={MSG_MAX}
                  placeholder={`e.g. Feedback open until Friday`}
                  disabled={isOpen}
                />
                {msg.length > 0 && (
                  <span className={`char-hint ${msg.length < MSG_MIN ? 'under' : 'ok'}`}>
                    {msg.length}/{MSG_MAX}
                  </span>
                )}
              </div>

              {err && <div className="alert alert-error" style={{ marginTop: 8 }}>{err}</div>}

              <button
                className={`btn btn-allot ${isOpen ? 'close' : 'open'}`}
                onClick={() => handleToggle(cls)}
              >
                {isOpen ? 'Close Session' : 'Allot'}
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default AdminAllotments;
