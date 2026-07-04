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
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { downloadCsv, downloadDoc } from '../utils/download';

import { API } from '../config/api';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'students', label: 'Students' },
  { key: 'feedbacks', label: 'Feedbacks' },
  { key: 'allotments', label: 'Allotments' },
  { key: 'anonymous', label: 'Anonymous' },
];

const AdminDbOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/admin/db-overview`).then(({ data }) => setData(data)).catch(() => setError('Failed to load database overview'));
  }, []);

  const collections = data?.collections;

  const filteredStudents = useMemo(() => {
    const allStudents = collections?.students?.all || [];
    if (!search) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [search, collections?.students?.all]);

  const filteredFeedbacks = useMemo(() => {
    const allFeedbacks = collections?.feedbacks?.all || [];
    if (!search) return allFeedbacks;
    const q = search.toLowerCase();
    return allFeedbacks.filter(f =>
      f.subject.toLowerCase().includes(q) ||
      (f.student?.name?.toLowerCase().includes(q)) ||
      (f.student?.usn?.toLowerCase().includes(q)) ||
      (f.comments?.toLowerCase().includes(q))
    );
  }, [search, collections?.feedbacks?.all]);

  if (error) return <div className="admin-db"><div className="alert alert-error">{error}</div></div>;
  if (!data) return <div className="loading">Loading database overview...</div>;

  return (
    <div className="admin-db">
      <div className="db-header">
        <button className="btn btn-back" onClick={() => navigate('/admin')}>← Admin Panel</button>
        <h2>Database Overview</h2>
      </div>

      <div className="db-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`db-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setSearch(''); }}
          >
            {tab.label}
            {tab.key !== 'dashboard' && (
              <span className="db-tab-count">
                {tab.key === 'anonymous'
                  ? (collections.publicFeedbacks?.count || 0)
                  : (collections[tab.key]?.count || 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab !== 'dashboard' && (
        <div className="db-search-bar">
          <input
            type="text"
            className="input"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {activeTab === 'dashboard' && <DashboardView collections={collections} />}
      {activeTab === 'students' && <StudentsView students={filteredStudents} total={collections.students.count} />}
      {activeTab === 'feedbacks' && <FeedbacksView feedbacks={filteredFeedbacks} total={collections.feedbacks.count} />}
      {activeTab === 'allotments' && <AllotmentsView allotments={collections.allotments.all} />}
      {activeTab === 'anonymous' && <AnonymousView feedbacks={collections.publicFeedbacks?.all || []} />}
    </div>
  );
};

const DashboardView = ({ collections }) => (
  <>
    <div className="db-summary">
      <div className="db-summary-card"><strong>{collections.students.count}</strong> Students</div>
      <div className="db-summary-card"><strong>{collections.feedbacks.count}</strong> Feedbacks</div>
      <div className="db-summary-card"><strong>{collections.feedbacks.totalSubjects}</strong> Subjects</div>
      <div className="db-summary-card"><strong>{collections.allotments.count}</strong> Allotments</div>
    </div>

    <div className="db-section">
      <h3>Students by Class</h3>
      <div className="db-class-grid">
        {Object.entries(collections.students.classGroups).filter(([cls]) => /[ABC] sec$/i.test(cls)).map(([cls, info]) => (
          <div key={cls} className="db-class-card">
            <div className="db-class-card-header">
              <h4>{cls}</h4>
              <span className="db-class-count">{info.total} student{info.total !== 1 ? 's' : ''}</span>
            </div>
            <div className="db-class-card-body">
              <div className="db-student-list">
                {info.students.map((s, i) => (
                  <div key={i} className="db-student-row">
                    <span className="db-name">{s.name}</span>
                    <span className="db-usn">{s.usn}</span>
                    <span className="db-email">{s.email}</span>
  
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="db-section">
      <h3>Feedback per Subject</h3>
      <div className="db-subject-grid">
        {Object.entries(collections.feedbacks.subjectStats).map(([sub, stats]) => {
          const pct = collections.students.count ? Math.round((stats.uniqueStudents / collections.students.count) * 100) : 0;
          return (
            <div key={sub} className="db-subject-card">
              <h4>{sub}</h4>
              <div className="db-subject-stats">
                <span><strong>{stats.total}</strong> submissions</span>
                <span><strong>{stats.uniqueStudents}</strong> students</span>
              </div>
              <div className="db-subject-bar">
                <div className="db-subject-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {collections.allotments.all.length > 0 && (
      <div className="db-section">
        <h3>Allotments</h3>
        <div className="db-allot-list">
          {collections.allotments.all.map((a, i) => (
            <div key={i} className={`db-allot-row ${a.isOpen ? 'open' : 'closed'}`}>
              <span className="db-allot-class">{a.classGroup}</span>
              <span className={`db-allot-status ${a.isOpen ? 'open' : 'closed'}`}>{a.isOpen ? 'Open' : 'Closed'}</span>
              {a.message && <span className="db-allot-msg">&quot;{a.message}&quot;</span>}
              <span className="db-allot-date">{new Date(a.allottedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

const StudentsView = ({ students, total }) => (
  <div className="db-table-wrapper">
    <p className="db-table-info">{students.length} of {total} student{total !== 1 ? 's' : ''}</p>
    <div className="db-table-scroll">
      <table className="db-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>USN</th>
            <th>Email</th>
            <th>Class</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id}>
              <td className="db-cell-num">{i + 1}</td>
              <td className="db-cell-name">{s.name}</td>
              <td className="db-cell-usn">{s.usn}</td>
              <td className="db-cell-email">{s.email}</td>
              <td><span className="db-tag">{s.classGroup}</span></td>
              <td>{s.role === 'admin' ? <span className="db-role-badge">Admin</span> : <span className="db-tag db-tag-student">Student</span>}</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan="6" className="db-empty">No students found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const FeedbacksView = ({ feedbacks, total }) => (
  <div className="db-table-wrapper">
    <p className="db-table-info">{feedbacks.length} of {total} feedback{total !== 1 ? 's' : ''}</p>
    <div className="db-table-scroll">
      <table className="db-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>USN</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Comments</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f, i) => (
            <tr key={f._id}>
              <td className="db-cell-num">{i + 1}</td>
              <td className="db-cell-name">{f.student?.name || 'Deleted'}</td>
              <td className="db-cell-usn">{f.student?.usn || '-'}</td>
              <td>{f.student?.classGroup ? <span className="db-tag">{f.student.classGroup}</span> : '-'}</td>
              <td className="db-cell-subject">{f.subject}</td>
              <td className="db-cell-comments" title={f.comments}>
                {f.comments?.length > 80 ? f.comments.slice(0, 80) + '...' : f.comments}
              </td>
              <td className="db-cell-date">{new Date(f.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {feedbacks.length === 0 && (
            <tr><td colSpan="7" className="db-empty">No feedbacks found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AllotmentsView = ({ allotments }) => (
  <div className="db-table-wrapper">
    <div className="db-table-scroll">
      <table className="db-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Class</th>
            <th>Status</th>
            <th>Message</th>
            <th>Allotted At</th>
          </tr>
        </thead>
        <tbody>
          {allotments.map((a, i) => (
            <tr key={a._id}>
              <td className="db-cell-num">{i + 1}</td>
              <td className="db-cell-class">{a.classGroup}</td>
              <td>
                <span className={`db-allot-status ${a.isOpen ? 'open' : 'closed'}`}>
                  {a.isOpen ? '● Open' : '○ Closed'}
                </span>
              </td>
              <td className="db-cell-comments">{a.message || '-'}</td>
              <td className="db-cell-date">{new Date(a.allottedAt).toLocaleString()}</td>
            </tr>
          ))}
          {allotments.length === 0 && (
            <tr><td colSpan="5" className="db-empty">No allotments found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AnonymousView = ({ feedbacks }) => {
  const downloadExcel = () => {
    const rows = feedbacks.map((f, i) => [
      i + 1, f.subject, f.facultyName || '-', f.comments || '', new Date(f.createdAt).toLocaleDateString(),
    ]);
    const headers = ['#', 'Subject', 'Faculty', 'Comments', 'Date'];
    downloadCsv([headers, ...rows], 'anonymous_feedbacks');
  };

  const downloadWord = () => {
    const headers = ['#', 'Subject', 'Faculty', 'Comments', 'Date'];
    const rows = feedbacks.map((f, i) => [
      String(i + 1), f.subject, f.facultyName || '-', f.comments || '-', new Date(f.createdAt).toLocaleDateString(),
    ]);
    downloadDoc('Anonymous Feedbacks', headers, rows, 'anonymous_feedbacks');
  };

  return (
  <div className="db-table-wrapper">
    <div className="db-table-header-row">
      <p className="db-table-info">{feedbacks.length} anonymous feedback{feedbacks.length !== 1 ? 's' : ''}</p>
      <div className="db-download-actions">
        <button className="btn btn-download" onClick={downloadExcel}>Download Excel</button>
        <button className="btn btn-download" onClick={downloadWord}>Download Word</button>
      </div>
    </div>
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
          {feedbacks.map((f, i) => (
            <tr key={f._id}>
              <td className="db-cell-num">{i + 1}</td>
              <td><span className="db-tag">{f.subject}</span></td>
              <td>{f.facultyName || '-'}</td>
              <td className="db-cell-comments" title={f.comments}>{f.comments}</td>
              <td className="db-cell-date">{new Date(f.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {feedbacks.length === 0 && (
            <tr><td colSpan="5" className="db-empty">No anonymous feedbacks yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default AdminDbOverview;
