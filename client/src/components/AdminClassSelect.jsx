import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const classInfo = [
  { id: 'MCA, 1st Year, 2nd Sem, A sec', label: 'A Section', students: '50 students' },
  { id: 'MCA, 1st Year, 2nd Sem, B sec', label: 'B Section', students: '0 students' },
  { id: 'MCA, 1st Year, 2nd Sem, C sec', label: 'C Section', students: '0 students' },
];

const AdminClassSelect = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const results = {};
        for (const cls of classInfo) {
          const { data } = await axios.get(`${API}/admin/feedback/stats?class=${encodeURIComponent(cls.id)}`);
          results[cls.id] = data.totalStudents;
        }
        setCounts(results);
      } catch (e) {
        // ignore
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="class-select-page">
      <h2>Select a Class</h2>
      <p className="subtitle">Choose a section to view feedback</p>
      <div className="class-grid">
        {classInfo.map((cls) => (
          <div key={cls.id} className="class-card" onClick={() => navigate(`/admin/${encodeURIComponent(cls.id)}`)}>
            <div className="class-card-header">
              <span className="class-badge">MCA</span>
              <span className="class-section">{cls.label}</span>
            </div>
            <p className="class-detail">1st Year, 2nd Semester</p>
            <p className="class-count">{counts[cls.id] !== undefined ? counts[cls.id] : '...'} Students</p>
            <span className="btn-small">View Feedback</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClassSelect;
