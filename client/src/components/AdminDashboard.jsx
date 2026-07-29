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
import '../styles/AdminDashboard.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Button from './ui/Button';
import { API } from '../config/api';

const AdminDashboard = () => {
  const { classGroup } = useParams();
  const decodedClass = decodeURIComponent(classGroup);
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  const classParam = `class=${encodeURIComponent(decodedClass)}`;

  useEffect(() => {
    const param = `class=${encodeURIComponent(decodedClass)}`;
    const fetchData = async () => {
      try {
        const [fbRes, statsRes] = await Promise.all([
          axios.get(`${API}/admin/feedback?${param}`),
          axios.get(`${API}/admin/feedback/stats?${param}`),
        ]);
        setFeedbacks(fbRes.data.data);
        setStats(statsRes.data);
        setSubjects(statsRes.data.subjects);
      } catch {
        setError('Failed to load dashboard');
      }
    };
    fetchData();
  }, [classGroup, decodedClass]);

  const filterBySubject = async (subject) => {
    setSelectedSubject(subject);
    if (subject === 'all') {
      const { data } = await axios.get(`${API}/admin/feedback?${classParam}`);
      setFeedbacks(data.data);
    } else {
      const { data } = await axios.get(`${API}/admin/feedback/subject/${encodeURIComponent(subject)}?${classParam}`);
      setFeedbacks(data.data);
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>← All Classes</Button>
        <h2>{decodedClass}</h2>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card"><h3>{stats.totalStudents}</h3><p>Students</p></div>
          <div className="stat-card"><h3>{stats.totalSubjects}</h3><p>Subjects</p></div>
          <div className="stat-card"><h3>{stats.totalFeedbacks}</h3><p>Feedbacks</p></div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-btn ${selectedSubject === 'all' ? 'active' : ''}`} onClick={() => filterBySubject('all')}>All</button>
        {subjects.map(s => (
          <button key={s} className={`filter-btn ${selectedSubject === s ? 'active' : ''}`} onClick={() => filterBySubject(s)}>{s}</button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>USN</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No feedback found for this class</td></tr>
            ) : (
              feedbacks.map((fb, i) => (
                <tr key={fb._id}>
                  <td>{i + 1}</td>
                  <td>{fb.student?.name || 'N/A'}</td>
                  <td>{fb.student?.usn || 'N/A'}</td>
                  <td>{fb.student?.email || 'N/A'}</td>
                  <td>{fb.subject}</td>
                  <td>{fb.comments || '-'}</td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
