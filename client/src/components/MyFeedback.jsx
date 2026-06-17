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
import { useState, useEffect } from 'react';
import axios from 'axios';

import { API } from '../config/api';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/feedback/my`).then(({ data }) => {
      setFeedbacks(data);
    }).catch(() => {
      setError('Failed to load feedback. Please try again.');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-feedback">
      <h2>My Feedback</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="loading-text">Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.subject}</td>
                  <td>{'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}</td>
                  <td>{fb.comments || '-'}</td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFeedback;
