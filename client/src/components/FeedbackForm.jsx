import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState({});
  const [locked, setLocked] = useState({});
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const MIN_LEN = 50;
  const MAX_LEN = 300;

  useEffect(() => {
    axios.get(`${API}/feedback/subjects`).then(({ data }) => setSubjects(data));
    const saved = JSON.parse(localStorage.getItem('fb_locked') || '{}');
    setLocked(saved);
    const savedFb = JSON.parse(localStorage.getItem('fb_drafts') || '{}');
    setFeedbacks(savedFb);
  }, []);

  const currentSubject = subjects[currentIndex];
  const isLast = currentIndex === subjects.length - 1;
  const totalSubjects = subjects.length;
  const currentText = (feedbacks[currentSubject] || '');
  const charCount = currentText.length;
  const textValid = charCount >= MIN_LEN && charCount <= MAX_LEN;
  const isLocked = !!locked[currentSubject];

  const updateDrafts = (updated) => {
    setFeedbacks(updated);
    localStorage.setItem('fb_drafts', JSON.stringify(updated));
  };

  const saveToDb = async (subject, comments) => {
    await axios.post(`${API}/feedback/submit`, { subject, rating: 3, comments: comments.trim() });
  };

  const doLock = async () => {
    const feedback = (feedbacks[currentSubject] || '').trim();
    const len = feedback.length;
    if (len < MIN_LEN) {
      setError(`Feedback must be at least ${MIN_LEN} characters (${len}/${MIN_LEN})`);
      return false;
    }
    if (len > MAX_LEN) {
      setError(`Feedback must not exceed ${MAX_LEN} characters (${len}/${MAX_LEN})`);
      return false;
    }
    setError('');
    try {
      await saveToDb(currentSubject, feedback);
      const newLocked = { ...locked, [currentSubject]: true };
      setLocked(newLocked);
      localStorage.setItem('fb_locked', JSON.stringify(newLocked));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save feedback');
      return false;
    }
  };

  const handleLockToggle = async () => {
    if (isLocked) {
      const newLocked = { ...locked, [currentSubject]: false };
      setLocked(newLocked);
      localStorage.setItem('fb_locked', JSON.stringify(newLocked));
      setError('');
    } else {
      await doLock();
    }
  };

  const handleNext = async () => {
    if (!isLocked) {
      const ok = await doLock();
      if (!ok) return;
    }
    if (currentIndex < totalSubjects - 1) {
      setCurrentIndex(currentIndex + 1);
      setError('');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError('');
    }
  };

  const handleTextChange = (e) => {
    const updated = { ...feedbacks, [currentSubject]: e.target.value };
    updateDrafts(updated);
  };

  const handleSubmit = () => {
    if (!isLocked) return;
    setShowPopup(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      for (const subject of subjects) {
        if (!locked[subject]) {
          const fb = (feedbacks[subject] || '').trim();
          if (fb) await saveToDb(subject, fb);
        }
      }
      localStorage.removeItem('fb_locked');
      localStorage.removeItem('fb_drafts');
      navigate('/my-feedback');
    } catch (err) {
      setError('Submit failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
      setShowPopup(false);
    }
  };

  const closePopup = () => setShowPopup(false);

  const jumpToSubject = (index) => {
    setCurrentIndex(index);
    setError('');
  };

  if (!subjects.length) return <div className="loading">Loading subjects...</div>;

  return (
    <div className="sequential-feedback">
      <div className="sf-header">
        <button className="btn btn-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <div className="sf-progress-text">Subject {currentIndex + 1} of {totalSubjects}</div>
      </div>

      <div className="sf-steps">
        {subjects.map((s, i) => {
          const stepLocked = !!locked[s];
          const isActive = i === currentIndex;
          return (
            <div
              key={i}
              className={`sf-step ${isActive ? 'active' : ''} ${stepLocked ? 'done' : ''}`}
              onClick={() => jumpToSubject(i)}
            >
              <span className="sf-step-num">{i + 1}</span>
              <span className="sf-step-label">{s}</span>
            </div>
          );
        })}
      </div>

      <div className="sf-card">
        <h2>{currentSubject}</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Your Feedback:</label>
          <textarea
            ref={textareaRef}
            value={currentText}
            onChange={handleTextChange}
            disabled={isLocked}
            rows={5}
            maxLength={MAX_LEN}
            placeholder={`Write your feedback (min ${MIN_LEN} chars)...`}
          />
          <div className={`char-counter ${charCount > 0 && charCount < MIN_LEN ? 'under' : charCount > MAX_LEN ? 'over' : 'ok'}`}>
            {charCount}/{MAX_LEN} {charCount < MIN_LEN ? `(min ${MIN_LEN})` : ''}
          </div>
        </div>

        <div className="sf-nav-actions">
          <button className="btn btn-prev" onClick={handlePrev} disabled={currentIndex === 0}>
            ← Previous
          </button>

          <div className="sf-lock-group">
            <button
              className={`btn ${isLocked ? 'btn-unlock' : 'btn-lock'}`}
              onClick={handleLockToggle}
              disabled={!isLocked && !textValid}
            >
              {isLocked ? 'Unlock' : 'Lock'}
            </button>
          </div>

          <button
            className="btn btn-next"
            onClick={isLast ? handleSubmit : handleNext}
            disabled={isLast ? (!isLocked || submitting) : !textValid}
          >
            {isLast ? (submitting ? 'Submitting...' : 'Submit All') : 'Next →'}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <h3>Feedback Summary</h3>
            <div className="popup-stats">
              <p>Total Subjects: <strong>{totalSubjects}</strong></p>
              <p>Feedback Given: <strong>{totalSubjects}</strong></p>
            </div>
            <p className="popup-note success">You have completed feedback on all {totalSubjects} subjects. Thank you!</p>
            <div className="popup-actions">
              <button className="btn btn-primary" onClick={confirmSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
              <button className="btn btn-cancel" onClick={closePopup}>Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
