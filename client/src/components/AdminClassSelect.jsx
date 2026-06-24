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
import '../styles/AdminClassSelect.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API } from '../config/api';

const sectionLabels = {
  'MCA, 1st Year, 2nd Sem, A sec': 'A Section',
  'MCA, 1st Year, 2nd Sem, B sec': 'B Section',
  'MCA, 1st Year, 2nd Sem, C sec': 'C Section',
};

const AdminClassSelect = () => {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: classes } = await axios.get(`${API}/admin/classes`);
        setClassList(classes);
        const results = {};
        for (const cls of classes) {
          const { data } = await axios.get(`${API}/admin/feedback/stats?class=${encodeURIComponent(cls)}`);
          results[cls] = data.totalStudents;
        }
        setCounts(results);
      } catch (e) {
        setClassList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading classes...</div>;

  return (
    <div className="class-select-page">
      <h2>Select a Class</h2>
      <p className="subtitle">Choose a section to view feedback</p>
      <div className="class-grid">
        {classList.map((cls) => (
          <div key={cls} className="class-card" onClick={() => navigate(`/admin/${encodeURIComponent(cls)}`)}>
            <div className="class-card-header">
              <span className="class-badge">MCA</span>
              <span className="class-section">{sectionLabels[cls] || cls}</span>
            </div>
            <p className="class-detail">1st Year, 2nd Semester</p>
            <p className="class-count">{counts[cls] !== undefined ? counts[cls] : '...'} Students</p>
            <span className="btn-small">View Feedback</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClassSelect;
