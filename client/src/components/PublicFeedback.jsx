import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const PublicFeedback = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/public/subjects`).then(({ data }) => setSubjects(data)).catch(() => {});
  }, []);

  const charCount = comments.length;
  const isValidLength = charCount >= 100 && charCount <= 300;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject) return;
    if (charCount < 100) { setError('Feedback must be at least 100 characters'); return; }
    if (charCount > 300) { setError('Feedback must be under 300 characters'); return; }
    try {
      await axios.post(`${API}/public/feedback`, { subject, facultyName, comments });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    }
  };

  if (submitted) {
    return (
    <div className="public-feedback public-feedback--dark">
        <div className="public-feedback__card">
          <div className="public-feedback__success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2>Thank You!</h2>
            <p>Your anonymous feedback has been submitted successfully.</p>
            <button className="public-feedback__btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-feedback public-feedback--dark">
      <div className="public-feedback__card">
        <div className="public-feedback__header">
          <img src="/footer-logo.png" alt="SOAS" className="public-feedback__logo" />
          <h2>Give Anonymous Feedback</h2>
          <p>Your identity will not be revealed. Share your honest thoughts.</p>
        </div>

        {error && <div className="public-feedback__error">{error}</div>}

        <form className="public-feedback__form" onSubmit={handleSubmit}>
          <div className="public-feedback__field">
            <label htmlFor="subject">Select Subject</label>
            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required>
              <option value="">Choose a subject...</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="public-feedback__field">
            <label htmlFor="faculty">Faculty Name <span className="public-feedback__optional">(optional)</span></label>
            <input id="faculty" type="text" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} placeholder="e.g. Dr. Smith" />
          </div>

          <div className="public-feedback__field">
            <label htmlFor="comments">Your Feedback <span className="public-feedback__required">*</span></label>
            <textarea
              id="comments"
              rows="5"
              placeholder="Share your thoughts on the subject, teaching, or anything else..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <div className={`public-feedback__charcount ${!isValidLength && charCount > 0 ? 'public-feedback__charcount--warn' : ''}`}>
              {charCount}/300 {charCount < 100 ? `(min 100)` : ''}
            </div>
          </div>

          <button type="submit" className="public-feedback__btn" disabled={!isValidLength}>Submit Anonymously</button>
        </form>

        <p className="public-feedback__footer">
          <button className="public-feedback__link" onClick={() => navigate('/')}>← Back to Home</button>
        </p>
      </div>
    </div>
  );
};

export default PublicFeedback;
