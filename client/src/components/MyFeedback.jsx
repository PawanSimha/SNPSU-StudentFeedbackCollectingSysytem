import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get(`${API}/feedback/my`).then(({ data }) => setFeedbacks(data));
  }, []);

  return (
    <div className="my-feedback">
      <h2>My Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id}>
                <td>{fb.subject}</td>
                <td>{fb.comments || '-'}</td>
                <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyFeedback;
