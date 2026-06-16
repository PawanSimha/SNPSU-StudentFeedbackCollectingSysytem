import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { classGroup } = useParams();
  const decodedClass = decodeURIComponent(classGroup);
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);

  const classParam = `class=${encodeURIComponent(decodedClass)}`;

  useEffect(() => {
    axios.get(`${API}/admin/feedback?${classParam}`).then(({ data }) => setFeedbacks(data));
    axios.get(`${API}/admin/feedback/stats?${classParam}`).then(({ data }) => {
      setStats(data);
      setSubjects(data.subjects);
    });
  }, [classGroup]);

  const filterBySubject = async (subject) => {
    setSelectedSubject(subject);
    if (subject === 'all') {
      const { data } = await axios.get(`${API}/admin/feedback?${classParam}`);
      setFeedbacks(data);
    } else {
      const { data } = await axios.get(`${API}/admin/feedback/subject/${encodeURIComponent(subject)}?${classParam}`);
      setFeedbacks(data);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <button className="btn btn-back" onClick={() => navigate('/admin')}>← All Classes</button>
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
              <th>Rating</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan="8" className="no-data">No feedback found for this class</td></tr>
            ) : (
              feedbacks.map((fb, i) => (
                <tr key={fb._id}>
                  <td>{i + 1}</td>
                  <td>{fb.student?.name || 'N/A'}</td>
                  <td>{fb.student?.usn || 'N/A'}</td>
                  <td>{fb.student?.email || 'N/A'}</td>
                  <td>{fb.subject}</td>
                  <td className="stars-cell">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</td>
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
