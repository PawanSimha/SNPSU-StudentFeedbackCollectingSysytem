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
import '../styles/AdminAllotments.css';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import CountUp from './ui/CountUp';
import Button from './ui/Button';
import { API } from '../config/api';
import {
  FileCheck, RefreshCw, Search, X, SlidersHorizontal,
  Users, Clock, TrendingUp, Calendar,
  Eye, MessageSquare, BarChart3,
  PieChart as PieChartIcon, Activity,
  Sparkles, Lock, Unlock, GraduationCap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MSG_MIN = 15;
const MSG_MAX = 50;

const sectionLabels = {
  'MCA, 1st Year, 2nd Sem, A sec': 'A Section',
  'MCA, 1st Year, 2nd Sem, B sec': 'B Section',
  'MCA, 1st Year, 2nd Sem, C sec': 'C Section',
};

const TEMPLATES = [
  { label: 'Custom', value: '' },
  { label: 'Feedback after IA-1', value: 'Feedback after IA-1 is now open. Please submit your responses by the end of this week.' },
  { label: 'Feedback after IA-2', value: 'Feedback after IA-2 is now open. Your inputs will help improve the teaching process.' },
  { label: 'End Semester Feedback', value: 'End Semester Feedback session is now open. Please share your feedback for this semester.' },
  { label: 'Course Completion Feedback', value: 'Course Completion Feedback is now open. Share your thoughts on the overall course experience.' },
];

const PIE_COLORS = ['#2e7d32', '#c62828', '#E5E7EB'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const AdminAllotments = () => {
  const [classList, setClassList] = useState([]);
  const [allotments, setAllotments] = useState({});
  const [dbOverview, setDbOverview] = useState(null);
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const refresh = () => {
    setLoading(true);
    setPageError('');
    fetchAllData();
  };

  const fetchAllData = () => {
    Promise.all([
      axios.get(`${API}/admin/classes`).then(({ data }) => data).catch(() => []),
      axios.get(`${API}/allotments`).then(({ data }) => data).catch(() => []),
      axios.get(`${API}/admin/db-overview`).then(({ data }) => data).catch(() => null),
    ]).then(([classes, allotmentsData, overview]) => {
      setClassList(classes);
      const map = {};
      const msgs = {};
      (allotmentsData || []).forEach(a => {
        map[a.classGroup] = a;
        msgs[a.classGroup] = a.message || '';
      });
      setAllotments(map);
      setMessages(msgs);
      setDbOverview(overview);
    }).catch(() => setPageError('Failed to load allotments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleToggle = async (classGroup) => {
    const msg = (messages[classGroup] || '').trim();
    const current = allotments[classGroup];

    if (!current || !current.isOpen) {
      if (msg.length < MSG_MIN) {
        setErrors({ ...errors, [classGroup]: `Message must be ${MSG_MIN}-${MSG_MAX} characters (${msg.length}/${MSG_MIN})` });
        return;
      }
      if (msg.length > MSG_MAX) {
        setErrors({ ...errors, [classGroup]: `Message must be ${MSG_MIN}-${MSG_MAX} characters (${msg.length}/${MSG_MAX})` });
        return;
      }
    }

    setErrors({ ...errors, [classGroup]: '' });
    setToggling(classGroup);

    try {
      const { data } = await axios.post(`${API}/allotments`, { classGroup, message: msg });
      setAllotments(prev => ({ ...prev, [classGroup]: data }));
      if (data.isOpen) {
        setMessages(prev => ({ ...prev, [classGroup]: data.message }));
        toast.success(`Session opened for ${sectionLabels[classGroup] || classGroup}`);
      } else {
        toast.success(`Session closed for ${sectionLabels[classGroup] || classGroup}`);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to toggle session';
      setErrors({ ...errors, [classGroup]: errMsg });
      toast.error(errMsg);
    } finally {
      setToggling(null);
    }
  };

  const handleOpenAll = async () => {
    const pending = classList.filter(cls => !allotments[cls] || !allotments[cls].isOpen);
    let success = 0;
    for (const cls of pending) {
      const msg = (messages[cls] || '').trim();
      if (msg.length < MSG_MIN || msg.length > MSG_MAX) continue;
      try {
        const { data } = await axios.post(`${API}/allotments`, { classGroup: cls, message: msg });
        setAllotments(prev => ({ ...prev, [cls]: data }));
        success++;
      } catch { /* skip */ }
    }
    if (success > 0) toast.success(`Opened ${success} session${success > 1 ? 's' : ''}`);
    else toast.error('Set valid messages for each class first');
  };

  const handleCloseAll = async () => {
    const open = classList.filter(cls => allotments[cls]?.isOpen);
    let success = 0;
    for (const cls of open) {
      try {
        const { data } = await axios.post(`${API}/allotments`, { classGroup: cls, message: '' });
        setAllotments(prev => ({ ...prev, [cls]: data }));
        success++;
      } catch { /* skip */ }
    }
    if (success > 0) toast.success(`Closed ${success} session${success > 1 ? 's' : ''}`);
  };

  const stats = useMemo(() => {
    const active = classList.filter(cls => allotments[cls]?.isOpen).length;
    const closed = classList.filter(cls => allotments[cls] && !allotments[cls].isOpen).length;
    const pending = classList.length - active - closed;
    const totalStudents = dbOverview?.collections?.students?.count || 0;
    const totalFeedbacks = dbOverview?.collections?.feedbacks?.count || 0;
    const completionRate = totalStudents ? Math.round((totalFeedbacks / (totalStudents * 6)) * 100) : 0;
    return { active, closed, pending, totalStudents, completionRate };
  }, [classList, allotments, dbOverview]);

  const filteredClasses = useMemo(() => {
    let result = classList;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(cls =>
        cls.toLowerCase().includes(q) || (sectionLabels[cls] || '').toLowerCase().includes(q)
      );
    }
    if (filters.length > 0) {
      result = result.filter(cls => {
        const a = allotments[cls];
        return filters.every(f => {
          if (f === 'open') return a?.isOpen === true;
          if (f === 'closed') return a && !a.isOpen;
          if (f === 'pending') return !a;
          if (f === 'A') return cls.includes('A sec');
          if (f === 'B') return cls.includes('B sec');
          if (f === 'C') return cls.includes('C sec');
          return true;
        });
      });
    }
    return result;
  }, [classList, search, filters, allotments]);

  const toggleFilter = (f) => {
    setFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleTemplate = (cls, value) => {
    setMessages(prev => ({ ...prev, [cls]: value }));
    setErrors(prev => ({ ...prev, [cls]: '' }));
  };

  const openConfirm = (cls, action) => {
    setConfirmDialog({ cls, action, isOpen: action === 'open' });
  };

  const allFilterOptions = ['open', 'closed', 'pending', 'A', 'B', 'C'];

  return (
    <motion.div className="aa" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div className="aa-header" variants={fadeUp}>
        <div className="aa-header__left">
          <div className="aa-header__icon"><FileCheck size={22} /></div>
          <div>
            <h1 className="aa-header__title">Allot Feedback Sessions</h1>
            <p className="aa-header__desc">Open or close feedback collection for each class section</p>
          </div>
        </div>
        <div className="aa-header__actions">
          <Button variant="outline" size="sm" onClick={refresh}><RefreshCw size={14} /> Refresh</Button>
          <Button variant="outline" size="sm" disabled={stats.active === classList.length} onClick={handleOpenAll}><Unlock size={14} /> Open All</Button>
          <Button variant="outline" size="sm" disabled={stats.active === 0} onClick={handleCloseAll}><Lock size={14} /> Close All</Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div className="aa-summary" variants={container}>
        <SummaryCard icon={GraduationCap} value={classList.length} label="Total Classes" color="var(--primary)" />
        <SummaryCard icon={Unlock} value={stats.active} label="Active Sessions" color="#2e7d32" />
        <SummaryCard icon={Lock} value={stats.closed} label="Closed Sessions" color="#c62828" />
        <SummaryCard icon={Clock} value={stats.pending} label="Pending Sessions" color="#C69E66" />
        <SummaryCard icon={Users} value={stats.totalStudents} label="Students Covered" color="var(--primary)" />
        <SummaryCard icon={TrendingUp} value={stats.completionRate} label="Completion Rate" color="#2e7d32" suffix="%" decimals={0} />
      </motion.div>

      {pageError && <div className="alert alert-error">{pageError}</div>}

      {/* Search + Filters */}
      <motion.div className="aa-toolbar" variants={fadeUp}>
        <div className="aa-search">
          <Search size={16} className="aa-search__icon" />
          <input
            type="text"
            className="aa-search__input"
            placeholder="Search by class or section..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="aa-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="aa-filters">
          <SlidersHorizontal size={14} className="aa-filters__icon" />
          {allFilterOptions.map(f => (
            <button
              key={f}
              className={`aa-chip ${filters.includes(f) ? 'is-active' : ''}`}
              onClick={() => toggleFilter(f)}
              aria-pressed={filters.includes(f)}
            >
              {f === 'A' ? 'A Section' : f === 'B' ? 'B Section' : f === 'C' ? 'C Section' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="aa-loading">
          {[1,2,3].map(i => (
            <div key={i} className="aa-skeleton-card">
              <div className="aa-skeleton" style={{ width: '60%', height: 20, marginBottom: 16 }} />
              <div className="aa-skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
              <div className="aa-skeleton" style={{ width: '80%', height: 14, marginBottom: 24 }} />
              <div className="aa-skeleton" style={{ width: '40%', height: 36 }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Session Cards */}
          <motion.div className="aa-grid" variants={container}>
            {filteredClasses.length === 0 ? (
              <div className="aa-empty">
                <FileCheck size={40} className="aa-empty__icon" />
                <p className="aa-empty__text">No classes match your search or filters</p>
              </div>
            ) : filteredClasses.map(cls => (
              <SessionCard
                key={cls}
                cls={cls}
                allotment={allotments[cls]}
                message={messages[cls] || ''}
                error={errors[cls] || ''}
                isOpen={allotments[cls]?.isOpen || false}
                toggling={toggling === cls}
                dbOverview={dbOverview}
                onToggle={() => openConfirm(cls, allotments[cls]?.isOpen ? 'close' : 'open')}
                onMessageChange={(val) => {
                  setMessages(prev => ({ ...prev, [cls]: val }));
                  setErrors(prev => ({ ...prev, [cls]: '' }));
                }}
                onTemplate={(val) => handleTemplate(cls, val)}
              />
            ))}
          </motion.div>

          {/* Activity + Analytics — 3 equal columns */}
          <div className="aa-bottom-grid">
            <motion.div className="aa-bottom-col" variants={fadeUp}>
              <SectionHeader icon={Activity} title="Recent Activity" />
              <div className="aa-activity">
                {classList.map(cls => {
                  const a = allotments[cls];
                  if (!a) return null;
                  const label = sectionLabels[cls] || cls.split(',').pop()?.trim() || cls;
                  return (
                    <div key={cls} className="aa-activity__item">
                      <div className={`aa-activity__icon aa-activity__icon--${a.isOpen ? 'success' : 'muted'}`}>
                        {a.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
                      </div>
                      <div className="aa-activity__content">
                        <span className="aa-activity__text">{a.isOpen ? `Session opened for ${label}` : `Session closed for ${label}`}</span>
                        <span className="aa-activity__date">{new Date(a.allottedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
                {classList.every(cls => !allotments[cls]) && (
                  <div className="aa-activity__empty">No activity yet</div>
                )}
              </div>
            </motion.div>

            <motion.div className="aa-bottom-col" variants={fadeUp}>
              <div className="aa-chart-card">
                <div className="aa-chart-card__header">
                  <PieChartIcon size={16} />
                  <span>Open vs Closed</span>
                </div>
                <div className="aa-chart-pie">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Active', value: Math.max(1, stats.active) },
                        { name: 'Closed', value: Math.max(1, stats.closed) },
                        { name: 'Pending', value: Math.max(1, stats.pending) },
                      ]} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value">
                        {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="aa-chart-legend">
                    <span><span className="aa-dot" style={{ background: '#2e7d32' }} /> Active ({stats.active})</span>
                    <span><span className="aa-dot" style={{ background: '#c62828' }} /> Closed ({stats.closed})</span>
                    <span><span className="aa-dot" style={{ background: '#E5E7EB' }} /> Pending ({stats.pending})</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="aa-bottom-col" variants={fadeUp}>
              <div className="aa-chart-card">
                <div className="aa-chart-card__header">
                  <BarChart3 size={16} />
                  <span>Sections</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={classList.map(function(cls) { return {
                    name: (sectionLabels[cls] || cls).charAt(0),
                    status: allotments[cls]?.isOpen ? 'Open' : allotments[cls] ? 'Closed' : 'Pending',
                  }; })} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    <Bar dataKey={() => 1} radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {classList.map((cls, i) => (
                        <Cell key={i} fill={allotments[cls]?.isOpen ? '#2e7d32' : allotments[cls] ? '#c62828' : '#E5E7EB'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <ConfirmationDialog
            cls={confirmDialog.cls}
            action={confirmDialog.action}
            sectionLabel={sectionLabels[confirmDialog.cls] || confirmDialog.cls}
            onConfirm={() => {
              handleToggle(confirmDialog.cls);
              setConfirmDialog(null);
            }}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Summary Card ── */
const SummaryCard = ({ icon: Icon, value, label, color, suffix = '', decimals = 0 }) => (
  <motion.div className="aa-summary-card" variants={scaleIn}>
    <div className="aa-summary-card__icon" style={{ background: `${color}12`, color }}>
      <Icon size={20} />
    </div>
    <div className="aa-summary-card__value">
      <CountUp end={value} duration={1.2} decimals={decimals} suffix={suffix} />
    </div>
    <div className="aa-summary-card__label">{label}</div>
  </motion.div>
);

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="aa-section-header">
    {Icon && <Icon size={16} className="aa-section-header__icon" />}
    <h3 className="aa-section-header__title">{title}</h3>
  </div>
);

/* ── Status Badge ── */
const StatusBadge = ({ status, children }) => {
  const cls = status === 'open' || status === 'success' ? 'aa-badge aa-badge--success'
    : status === 'closed' || status === 'muted' ? 'aa-badge aa-badge--muted'
    : status === 'pending' || status === 'warning' ? 'aa-badge aa-badge--warning'
    : 'aa-badge aa-badge--info';
  return <span className={cls}>{children || status}</span>;
};

/* ── Session Card ── */
const SessionCard = ({
  cls, allotment, message, error, isOpen, toggling, dbOverview, onToggle, onMessageChange, onTemplate,
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const label = sectionLabels[cls] || cls;

  const classData = dbOverview?.collections?.students?.classGroups?.[cls];
  const classStudents = classData?.total || 0;
  const classFeedbackCount = dbOverview?.collections?.feedbacks?.all?.filter(f => f.student?.classGroup === cls)?.length || 0;
  const subjectsTotal = dbOverview?.collections?.feedbacks?.totalSubjects || 6;
  const pct = classStudents ? Math.round((classFeedbackCount / (classStudents * subjectsTotal)) * 100) : 0;

  const createdDate = allotment?.allottedAt ? new Date(allotment.allottedAt) : null;
  const now = new Date();
  const duration = createdDate ? Math.round((now - createdDate) / (1000 * 60 * 60 * 24)) : '-';
  const isPending = !allotment;

  return (
    <motion.div
      className={`aa-card ${isOpen ? 'aa-card--open' : isPending ? 'aa-card--pending' : 'aa-card--closed'}`}
      variants={scaleIn}
    >
      {/* Card Header */}
      <div className="aa-card__head">
        <div className="aa-card__head-left">
          <div className="aa-card__avatar">{label.charAt(0)}</div>
          <div>
            <h3 className="aa-card__title">{label}</h3>
            <span className="aa-card__sub">{cls.split(',').slice(0, 2).join(',')}</span>
          </div>
        </div>
        <div className="aa-card__head-right">
          <StatusBadge status={isOpen ? 'success' : isPending ? 'warning' : 'muted'}>
            {isOpen ? 'Open' : isPending ? 'Pending' : 'Closed'}
          </StatusBadge>
          <span className="aa-card__students"><Users size={13} /> {classStudents}</span>
        </div>
      </div>

      {/* Body grid */}
      <div className="aa-card__body">
        {/* Message + Templates */}
        <div className="aa-card__field">
          <div className="aa-card__field-header">
            <label className="aa-card__label">Session Message</label>
            <div className="aa-card__templates">
              <button className="aa-tpl-btn" onClick={() => setShowTemplates(!showTemplates)}>
                <Sparkles size={13} /> Templates
              </button>
              <AnimatePresence>
                {showTemplates && (
                  <motion.div className="aa-tpl-dropdown" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                    {TEMPLATES.map(t => (
                      <button key={t.label} className="aa-tpl-option" onClick={() => { onTemplate(t.value); setShowTemplates(false); }}>
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <textarea
            className={`aa-textarea ${error ? 'is-error' : ''}`}
            value={message}
            onChange={e => onMessageChange(e.target.value)}
            maxLength={MSG_MAX}
            placeholder="e.g. Feedback open until Friday. Please submit your responses."
            disabled={isOpen}
            rows={2}
          />
          <div className="aa-card__field-footer">
            {message.length > 0 && (
              <span className={`aa-charcount ${message.length < MSG_MIN ? 'is-under' : 'is-ok'}`}>
                {message.length}/{MSG_MAX} chars
              </span>
            )}
            {message.length === 0 && <span />}
            {error && <span className="aa-error-msg">{error}</span>}
          </div>
        </div>

        {/* Details */}
        <div className="aa-card__details">
          <div className="aa-card__detail">
            <Calendar size={13} />
            <span>Opened: {createdDate ? createdDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not yet'}</span>
          </div>
          <div className="aa-card__detail">
            <Clock size={13} />
            <span>Duration: {duration === '-' ? '-' : `${duration} day${duration !== 1 ? 's' : ''}`}</span>
          </div>
          <div className="aa-card__detail">
            <Activity size={13} />
            <span>Status: {isOpen ? 'Accepting feedback' : isPending ? 'Not started' : 'Feedback closed'}</span>
          </div>
          {allotment?.message && (
            <div className="aa-card__detail aa-card__detail--msg">
              <MessageSquare size={13} />
              <span>&ldquo;{allotment.message}&rdquo;</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {allotment && (
        <div className="aa-card__progress">
          <div className="aa-card__progress-track">
            <div className="aa-card__progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 70 ? '#2e7d32' : pct >= 40 ? '#C69E66' : '#c62828' }} />
          </div>
          <span className="aa-card__progress-label">{classFeedbackCount} submissions · {pct}% completion</span>
        </div>
      )}

      {/* Actions */}
      <div className="aa-card__actions">
        {isOpen ? (
          <Button variant="danger" size="sm" loading={toggling} onClick={onToggle}>
            <Lock size={14} /> Close Session
          </Button>
        ) : (
          <Button variant="primary" size="sm" loading={toggling} onClick={onToggle}>
            <Unlock size={14} /> {allotment ? 'Reopen Session' : 'Open Session'}
          </Button>
        )}
        <Button variant="ghost" size="sm" disabled>
          <Eye size={14} /> Preview
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <BarChart3 size={14} /> Analytics
        </Button>
      </div>
    </motion.div>
  );
};

/* ── Confirmation Dialog ── */
const ConfirmationDialog = ({ cls, action, sectionLabel, onConfirm, onCancel }) => (
  <motion.div className="aa-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div
      className="aa-dialog"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="aa-dialog__icon">
        {action === 'open' ? <Unlock size={24} /> : <Lock size={24} />}
      </div>
      <h3 id="confirm-title" className="aa-dialog__title">
        {action === 'open' ? 'Open Session' : 'Close Session'}
      </h3>
      <p className="aa-dialog__desc">
        {action === 'open'
          ? `This will open the feedback session for "${sectionLabel}". Students will be able to submit their feedback immediately.`
          : `This will close the feedback session for "${sectionLabel}". Students will no longer be able to submit feedback.`
        }
      </p>
      <div className="aa-dialog__meta">
        <span><strong>Class:</strong> {cls}</span>
        <span><strong>Action:</strong> {action === 'open' ? 'Open Session' : 'Close Session'}</span>
      </div>
      <div className="aa-dialog__actions">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant={action === 'open' ? 'primary' : 'danger'} size="sm" onClick={onConfirm}>
          {action === 'open' ? 'Open Session' : 'Close Session'}
        </Button>
      </div>
    </motion.div>
  </motion.div>
);

export default AdminAllotments;
