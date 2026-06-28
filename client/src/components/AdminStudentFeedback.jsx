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
import '../styles/AdminStudentFeedback.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API } from '../config/api';

const AdminStudentFeedback = () => {
  const { classGroup, studentId } = useParams();
  const decodedClass = decodeURIComponent(classGroup);
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const classParam = `class=${encodeURIComponent(decodedClass)}`;

  useEffect(() => {
    axios.get(`${API}/admin/feedback?${classParam}&student=${studentId}`).then(({ data: wrapper }) => {
      const feedbacks = wrapper.data || [];
      setFeedbacks(feedbacks);
      const unique = [...new Set(feedbacks.map(f => f.subject))];
      setSubjects(unique);
      if (feedbacks.length > 0) setStudent(feedbacks[0].student);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [classGroup, studentId, classParam]);

  const filterBySubject = async (subject) => {
    setSelectedSubject(subject);
    if (subject === 'all') {
      const { data } = await axios.get(`${API}/admin/feedback?${classParam}&student=${studentId}`);
      setFeedbacks(data.data);
    } else {
      const { data } = await axios.get(`${API}/admin/feedback/subject/${encodeURIComponent(subject)}?${classParam}&student=${studentId}`);
      setFeedbacks(data.data);
    }
  };

  return (
    <div className="admin-student-feedback">
      <div className="dashboard-header">
        <button className="btn btn-back" onClick={() => navigate(`/admin/${encodeURIComponent(decodedClass)}`)}>← All Students</button>
      </div>

      {loading ? (
        <p className="loading-text">Loading feedback...</p>
      ) : student && (
        <div className="student-profile">
          <div className="student-avatar large">{student.name.charAt(0)}</div>
          <div className="profile-details">
            <h2>{student.name}</h2>
            <p className="student-usn">{student.usn}</p>
            <p className="student-email">{student.email}</p>
          </div>
        </div>
      )}

      {feedbacks.length > 0 && (
        <div className="stats-grid one-col">
          <div className="stat-card"><h3>{feedbacks.length}</h3><p>Subjects Reviewed</p></div>
        </div>
      )}

      {subjects.length > 1 && (
        <div className="filter-bar">
          <button className={`filter-btn ${selectedSubject === 'all' ? 'active' : ''}`} onClick={() => filterBySubject('all')}>All ({feedbacks.length})</button>
          {subjects.map(s => (
            <button key={s} className={`filter-btn ${selectedSubject === s ? 'active' : ''}`} onClick={() => filterBySubject(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="feedback-cards">
        {feedbacks.length === 0 ? (
          <p className="no-data">No feedback submitted</p>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb._id} className="feedback-card">
              <div className="feedback-card-header">
                <h4>{fb.subject}</h4>
                <span className="stars-cell">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                <span className="feedback-date">{new Date(fb.createdAt).toLocaleDateString()}</span>
              </div>
              {fb.comments && <p className="feedback-comments">{fb.comments}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStudentFeedback;
