import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const AdminAnonymous = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/public/feedbacks`).then(({ data }) => { setFeedbacks(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = feedbacks.filter(f =>
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    (f.facultyName || '').toLowerCase().includes(search.toLowerCase()) ||
    f.comments.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading anonymous feedbacks...</div>;

  return (
    <div className="admin-db">
      <div className="db-header">
        <button className="btn btn-back" onClick={() => navigate('/admin')}>← Admin Panel</button>
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
