import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const MSG_MIN = 15;
const MSG_MAX = 50;

const classList = [
  { id: 'MCA, 1st Year, 2nd Sem, A sec', label: 'A Section' },
  { id: 'MCA, 1st Year, 2nd Sem, B sec', label: 'B Section' },
  { id: 'MCA, 1st Year, 2nd Sem, C sec', label: 'C Section' },
];

const AdminAllotments = () => {
  const navigate = useNavigate();
  const [allotments, setAllotments] = useState({});
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    axios.get(`${API}/allotments`).then(({ data }) => {
      const map = {};
      const msgs = {};
      data.forEach(a => {
        map[a.classGroup] = a;
        msgs[a.classGroup] = a.message || '';
      });
      setAllotments(map);
      setMessages(msgs);
    }).catch(() => setPageError('Failed to load allotments'));
  }, []);

  const handleToggle = async (classGroup) => {
    const msg = (messages[classGroup] || '').trim();
    const current = allotments[classGroup];

    if (!current || !current.isOpen) {
      if (msg.length < MSG_MIN) {
        setErrors({ ...errors, [classGroup]: `Message min ${MSG_MIN} characters (${msg.length}/${MSG_MIN})` });
        return;
      }
      if (msg.length > MSG_MAX) {
        setErrors({ ...errors, [classGroup]: `Message max ${MSG_MAX} characters (${msg.length}/${MSG_MAX})` });
        return;
      }
    }

    setErrors({ ...errors, [classGroup]: '' });

    try {
      const { data } = await axios.post(`${API}/allotments`, { classGroup, message: msg });
      setAllotments({ ...allotments, [classGroup]: data });
      if (data.isOpen) {
        setMessages({ ...messages, [classGroup]: data.message });
      }
    } catch (err) {
      setErrors({ ...errors, [classGroup]: err.response?.data?.message || 'Failed to toggle' });
    }
  };

  return (
    <div className="admin-allotments">
      <h2>Allot Feedback Sessions</h2>
      <p className="subtitle">Open or close feedback for each class</p>

      {pageError && <div className="alert alert-error">{pageError}</div>}

      <div className="allotment-list">
        {classList.map((cls) => {
          const state = allotments[cls.id];
          const isOpen = state?.isOpen || false;
          const msg = messages[cls.id] || '';
          const err = errors[cls.id] || '';

          return (
            <div key={cls.id} className={`allotment-card ${isOpen ? 'open' : 'closed'}`}>
              <div className="allotment-card-header">
                <span className="class-badge">MCA</span>
                <span className="class-section">{cls.label}</span>
                <span className={`allot-status ${isOpen ? 'open' : 'closed'}`}>
                  {isOpen ? '● Open' : '○ Closed'}
                </span>
              </div>
              <p className="allotment-class-name">{cls.id}</p>

              <div className="allotment-message-group">
                <label>Session Message (optional, {MSG_MIN}–{MSG_MAX} chars):</label>
                <input
                  type="text"
                  className="allotment-input"
                  value={msg}
                  onChange={(e) => setMessages({ ...messages, [cls.id]: e.target.value })}
                  maxLength={MSG_MAX}
                  placeholder={`e.g. Feedback open until Friday`}
                  disabled={isOpen}
                />
                {msg.length > 0 && (
                  <span className={`char-hint ${msg.length < MSG_MIN ? 'under' : 'ok'}`}>
                    {msg.length}/{MSG_MAX}
                  </span>
                )}
              </div>

              {err && <div className="alert alert-error" style={{ marginTop: 8 }}>{err}</div>}

              <button
                className={`btn btn-allot ${isOpen ? 'close' : 'open'}`}
                onClick={() => handleToggle(cls.id)}
              >
                {isOpen ? 'Close Session' : 'Allot'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAllotments;
