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
import '../styles/AdminTable.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Button from './ui/Button';
import { API } from '../config/api';

const AdminAnonymous = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/public/feedbacks`).then(({ data }) => { setFeedbacks(data); setLoading(false); }).catch(() => { setError('Failed to load anonymous feedbacks'); setLoading(false); });
  }, []);

  const filtered = feedbacks.filter(f =>
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    (f.facultyName || '').toLowerCase().includes(search.toLowerCase()) ||
    f.comments.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading anonymous feedbacks...</div>;

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="admin-db">
      <div className="db-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>← Admin Panel</Button>
        <h2>Anonymous Feedbacks ({feedbacks.length})</h2>
      </div>
      <div className="db-search-bar">
        <input
          type="text"
          className="input"
          placeholder="Search by subject, faculty or comments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="db-table-wrapper">
        <p className="db-table-info">{filtered.length} of {feedbacks.length} anonymous feedbacks</p>
        <div className="db-table-scroll">
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Comments</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f._id}>
                  <td className="db-cell-num">{i + 1}</td>
                  <td><span className="db-tag">{f.subject}</span></td>
                  <td>{f.facultyName || '-'}</td>
                  <td className="db-cell-comments" title={f.comments}>{f.comments}</td>
                  <td className="db-cell-date">{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="5" className="db-empty">No anonymous feedbacks found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnonymous;
