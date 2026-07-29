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
import '../styles/AdminStudents.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { downloadCsv, downloadDoc } from '../utils/download';

import Button from './ui/Button';
import { API } from '../config/api';

const AdminStudents = () => {
  const { classGroup } = useParams();
  const decodedClass = decodeURIComponent(classGroup);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [subjectFeedback, setSubjectFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('given');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const classParam = `class=${encodeURIComponent(decodedClass)}`;

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/students?${classParam}`),
      axios.get(`${API}/feedback/subjects`),
    ]).then(([studentsRes, subjectsRes]) => {
      setStudents(studentsRes.data.data);
      setSubjects(subjectsRes.data);
    }).catch(() => setError('Failed to load students')).finally(() => setLoading(false));
  }, [classGroup, classParam]);

  const showSubjectFeedback = async (subject) => {
    setSelectedSubject(subject);
    setActiveTab('given');
    const { data } = await axios.get(`${API}/admin/feedback/subject/${encodeURIComponent(subject)}/coverage?${classParam}`);
    setCoverage(data);
    const fbRes = await axios.get(`${API}/admin/feedback/subject/${encodeURIComponent(subject)}?${classParam}`);
    setSubjectFeedback(fbRes.data.data);
  };

  const showStudents = () => {
    setSelectedSubject(null);
    setCoverage(null);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.usn.toLowerCase().includes(search.toLowerCase())
  );

  const safeClass = decodedClass.replace(/[,\s]+/g, '_');

  const downloadExcel = () => {
    const rows = subjectFeedback.map((fb, i) => [
      i + 1, fb.student?.name || '-', fb.student?.usn || '-', fb.comments || '', new Date(fb.createdAt).toLocaleDateString(),
    ]);
    const headers = ['#', 'Name', 'USN', 'Comments', 'Date'];
    downloadCsv([headers, ...rows], `${safeClass}_${selectedSubject?.replace(/[\s]+/g, '_')}_feedback`);
  };

  const downloadWord = () => {
    const headers = ['#', 'Name', 'USN', 'Comments', 'Date'];
    const rows = subjectFeedback.map((fb, i) => [
      String(i + 1), fb.student?.name || '-', fb.student?.usn || '-', fb.comments || '-', new Date(fb.createdAt).toLocaleDateString(),
    ]);
    const title = `${decodedClass} - ${selectedSubject} - Feedback`;
    downloadDoc(title, headers, rows, `${safeClass}_${selectedSubject?.replace(/[\s]+/g, '_')}_feedback`);
  };

  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="admin-students">
      <div className="dashboard-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>← All Classes</Button>
        <div>
          <h2>{decodedClass}</h2>
          <p className="subtitle">{students.length} Students &middot; {subjects.length} Subjects</p>
        </div>
      </div>

      <div className="subjects-section">
        <div className="subjects-section-header">
          <h4>Subjects</h4>
          {selectedSubject && (
            <Button variant="ghost" size="sm" onClick={showStudents}>← All Students</Button>
          )}
        </div>
        <div className="subject-chips">
          {subjects.map(s => (
            <button
              key={s}
              className={`chip ${selectedSubject === s ? 'active' : ''}`}
              onClick={() => showSubjectFeedback(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading students...</p>
      ) : selectedSubject ? (
        <div className="subject-feedback-view">
          <h3>Feedback on <span className="highlight">{selectedSubject}</span></h3>

          {coverage && (
            <div className="coverage-bar">
              <div className="coverage-stats">
                <span className="coverage-gave">{coverage.gavePercent}% Given ({coverage.gaveCount})</span>
                <span className="coverage-sep">|</span>
                <span className="coverage-not">{coverage.notGivenPercent}% Not Given ({coverage.notGivenCount})</span>
                <span className="coverage-total">of {coverage.totalStudents} students</span>
              </div>
              <div className="coverage-track">
                <div className="coverage-fill" style={{ width: `${coverage.gavePercent}%` }}></div>
              </div>
            </div>
          )}

          <div className="download-actions" style={{ marginBottom: 16 }}>
            <Button variant="outline" size="sm" onClick={downloadExcel}>Download Excel</Button>
            <Button variant="outline" size="sm" onClick={downloadWord}>Download Word</Button>
          </div>

          <div className="coverage-tabs">
            <button className={`cov-tab ${activeTab === 'given' ? 'active' : ''}`} onClick={() => setActiveTab('given')}>
              Given ({coverage?.gaveCount || 0})
            </button>
            <button className={`cov-tab ${activeTab === 'notGiven' ? 'active' : ''}`} onClick={() => setActiveTab('notGiven')}>
              Not Given ({coverage?.notGivenCount || 0})
            </button>
          </div>

          {activeTab === 'given' && (
            <div className="student-list-panel">
              <p className="panel-title">Students who gave feedback on {selectedSubject}</p>
              {coverage?.gaveStudents.length === 0 ? (
                <p className="no-data">No students gave feedback</p>
              ) : (
                <div className="student-list-grid">
                  {coverage?.gaveStudents.map(s => (
                    <div key={s._id} className="student-list-card" onClick={() => navigate(`/admin/${encodeURIComponent(decodedClass)}/student/${s._id}`)}>
                      <div className="student-avatar">{s.name.charAt(0)}</div>
                      <div className="student-info">
                        <h4>{s.name}</h4>
                        <p className="student-usn">{s.usn}</p>
                        <p className="student-email">{s.email}</p>
                      </div>
                      <span className="badge badge-gave">Gave</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notGiven' && (
            <div className="student-list-panel">
              <p className="panel-title">Students who have NOT given feedback on {selectedSubject}</p>
              {coverage?.notGivenStudents.length === 0 ? (
                <p className="no-data">All students have given feedback</p>
              ) : (
                <div className="student-list-grid">
                  {coverage?.notGivenStudents.map(s => (
                    <div key={s._id} className="student-list-card" onClick={() => navigate(`/admin/${encodeURIComponent(decodedClass)}/student/${s._id}`)}>
                      <div className="student-avatar">{s.name.charAt(0)}</div>
                      <div className="student-info">
                        <h4>{s.name}</h4>
                        <p className="student-usn">{s.usn}</p>
                        <p className="student-email">{s.email}</p>
                      </div>
                      <span className="badge badge-not">Not Given</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or USN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search students by name or USN"
          />
          <div className="student-grid">
            {filtered.length === 0 ? (
              <p className="no-data">No students found</p>
            ) : (
              filtered.map((s) => (
                <div key={s._id} className="student-card" onClick={() => navigate(`/admin/${encodeURIComponent(decodedClass)}/student/${s._id}`)}>
                  <div className="student-avatar">{s.name.charAt(0)}</div>
                  <div className="student-info">
                    <h4>{s.name}</h4>
                    <p className="student-usn">{s.usn}</p>
                    <p className="student-email">{s.email}</p>
                  </div>
                  <span className="btn-small">View Reviews</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStudents;
