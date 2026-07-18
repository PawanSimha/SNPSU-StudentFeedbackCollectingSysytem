import '../styles/Dashboard.css';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  BookOpen, CheckCircle, Clock, FileText,
  BarChart3, ArrowRight, ChevronRight, Target, ShieldCheck,
  MessageSquare, ClipboardList, User, Activity,
  Award, PenSquare, Eye, Zap, AlertCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { API } from '../config/api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

const DashboardCard = ({ children, className = '' }) => (
  <div className={`d-card${className ? ' ' + className : ''}`}>{children}</div>
);

const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div className="d-stat-card" variants={scaleIn}>
    <div className="d-stat-card__icon" style={{ background: `${color}12`, color }}>
      <Icon size={20} />
    </div>
    <div className="d-stat-card__info">
      <span className="d-stat-card__value">{value}</span>
      <span className="d-stat-card__label">{label}</span>
    </div>
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, action }) => (
  <div className="d-section-header">
    <div className="d-section-header__left">
      {Icon && <Icon size={18} className="d-section-header__icon" />}
      <h3 className="d-section-header__title">{title}</h3>
    </div>
    {action && <div className="d-section-header__action">{action}</div>}
  </div>
);

const Badge = ({ variant, children }) => (
  <span className={`d-badge d-badge--${variant}`}>{children}</span>
);

const Skeleton = ({ width = '100%', height = 20, style = {} }) => (
  <div className="d-skeleton" style={{ width, height, ...style }} />
);

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [allotment, setAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let locked;
  try { locked = JSON.parse(localStorage.getItem('fb_locked') || '{}'); } catch { locked = {}; }
  const lockedCount = Object.values(locked).filter(Boolean).length;
  const totalSubjects = 6;
  const completedCount = lockedCount;
  const remainingCount = totalSubjects - completedCount;
  const progressPct = Math.round((completedCount / totalSubjects) * 100);

  useEffect(() => {
    axios.get(`${API}/allotments/status`).then(({ data }) => {
      setAllotment(data);
    }).catch(() => {
      setError('Unable to check feedback session status.');
    }).finally(() => setLoading(false));
  }, []);

  const classGroup = student?.classGroup || '';
  const semester = classGroup.includes('2nd Sem') ? '2nd Semester' : classGroup.includes('1st Sem') ? '1st Semester' : 'MCA';
  const department = 'School of Sciences (SOAS)';

  const activityItems = useMemo(() => {
    const items = [];
    const today = new Date();
    const fmt = (d) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    if (allotment?.open) {
      items.push({ date: fmt(today), icon: Zap, text: 'Feedback session is active', variant: 'success' });
      if (lockedCount > 0) items.push({ date: fmt(today), icon: CheckCircle, text: `Locked ${lockedCount} of ${totalSubjects} subjects`, variant: 'primary' });
    } else {
      items.push({ date: fmt(today), icon: AlertCircle, text: 'No active feedback session', variant: 'muted' });
    }
    items.push({ date: fmt(new Date(today.getTime() - 86400000)), icon: Activity, text: 'Dashboard accessed', variant: 'muted' });
    return items;
  }, [allotment, lockedCount, totalSubjects]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="d-skeleton-header">
          <Skeleton width="280px" height={28} />
          <Skeleton width="200px" height={16} style={{ marginTop: 8 }} />
        </div>
        <div className="d-stats-grid" style={{ marginTop: 28 }}>
          {[1,2,3,4].map(i => <div key={i} className="d-card"><Skeleton height={80} /></div>)}
        </div>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="d-card"><Skeleton height={200} /></div>
          <div className="d-card"><Skeleton height={200} /></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="dashboard" variants={container} initial="hidden" animate="show">
      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Header ── */}
      <motion.div className="d-header" variants={fadeUp}>
        <div className="d-header__main">
          <div className="d-header__avatar">
            <User size={24} />
          </div>
          <div className="d-header__info">
            <h1 className="d-header__greeting">Welcome back, {student?.name?.split(' ')[0] || 'Student'}</h1>
            <p className="d-header__meta">
              {student?.usn} &middot; {student?.email}
            </p>
            <p className="d-header__sub">
              {semester} &middot; {department}
            </p>
          </div>
        </div>
        <div className="d-header__status">
          <Badge variant={allotment?.open ? 'success' : 'default'}>
            {allotment?.open ? 'Session Active' : 'No Active Session'}
          </Badge>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div className="d-stats-grid" variants={container}>
        <StatCard icon={BookOpen} value={totalSubjects} label="Total Subjects" color="var(--primary)" />
        <StatCard icon={CheckCircle} value={completedCount} label="Completed" color="var(--success)" />
        <StatCard icon={Clock} value={remainingCount} label="Remaining" color="var(--accent)" />
        <StatCard icon={TrendingUp} value={`${progressPct}%`} label="Progress" color="var(--primary)" />
      </motion.div>

      {/* ── Session Card + Quick Actions ── */}
      <div className="d-grid-2col">
        <motion.div variants={fadeUp}>
          <DashboardCard>
            <SectionHeader icon={allotment?.open ? Zap : Clock} title={allotment?.open ? 'Active Session' : 'No Active Session'} />
            {allotment?.open ? (
              <div className="d-session-active">
                <div className="d-session-active__msg">
                  <ShieldCheck size={20} />
                  <p>{allotment.message || 'Feedback session is currently open. Submit your responses before the deadline.'}</p>
                </div>
                <div className="d-session-active__bar">
                  <div className="d-session-active__bar-track">
                    <div className="d-session-active__bar-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span className="d-session-active__bar-label">{progressPct}% complete</span>
                </div>
                <div className="d-session-active__info">
                  <div className="d-session-active__info-item">
                    <FileText size={14} />
                    <span>Subjects: {totalSubjects}</span>
                  </div>
                  <div className="d-session-active__info-item">
                    <CheckCircle size={14} />
                    <span>Locked: {completedCount}</span>
                  </div>
                  <div className="d-session-active__info-item">
                    <Clock size={14} />
                    <span>Remaining: {remainingCount}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-session-empty">
                <ClipboardList size={40} className="d-session-empty__icon" />
                <h4 className="d-session-empty__title">No Active Feedback Session</h4>
                <p className="d-session-empty__desc">
                  Sessions are opened by your administrator after each class or assessment. Check back later.
                </p>
              </div>
            )}
          </DashboardCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <DashboardCard>
            <SectionHeader icon={Zap} title="Quick Actions" />
            <div className="d-quick-actions">
              {allotment?.open ? (
                <button className="d-quick-action d-quick-action--primary" onClick={() => navigate('/feedback')}>
                  <PenSquare size={20} />
                  <div className="d-quick-action__text">
                    <span className="d-quick-action__title">{lockedCount > 0 ? 'Continue Feedback' : 'Start Feedback'}</span>
                    <span className="d-quick-action__desc">{lockedCount > 0 ? `${remainingCount} subjects remaining` : `${totalSubjects} subjects to review`}</span>
                  </div>
                  <ChevronRight size={18} className="d-quick-action__arrow" />
                </button>
              ) : (
                <div className="d-quick-action d-quick-action--disabled">
                  <PenSquare size={20} />
                  <div className="d-quick-action__text">
                    <span className="d-quick-action__title">Feedback Unavailable</span>
                    <span className="d-quick-action__desc">Wait for administrator to open a session</span>
                  </div>
                </div>
              )}
              <button className="d-quick-action" onClick={() => navigate('/my-feedback')}>
                <Eye size={20} />
                <div className="d-quick-action__text">
                  <span className="d-quick-action__title">View My Feedback</span>
                  <span className="d-quick-action__desc">Review your past submissions</span>
                </div>
                <ChevronRight size={18} className="d-quick-action__arrow" />
              </button>

            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* ── How Feedback Works + Guidelines ── */}
      <div className="d-grid-2col">
        <motion.div variants={fadeUp}>
          <DashboardCard>
            <SectionHeader icon={BarChart3} title="How Feedback Works" />
            <div className="d-stepper">
              <div className="d-step">
                <div className="d-step__circle"><PenSquare size={16} /></div>
                <div className="d-step__connector" />
                <div className="d-step__content">
                  <h4 className="d-step__title">Write Your Comments</h4>
                  <p className="d-step__desc">Share your thoughts (50–300 characters per subject). Be specific about what worked and what could improve.</p>
                </div>
              </div>
              <div className="d-step">
                <div className="d-step__circle"><LockIcon size={16} /></div>
                <div className="d-step__connector" />
                <div className="d-step__content">
                  <h4 className="d-step__title">Lock Your Response</h4>
                  <p className="d-step__desc">Each subject's feedback is locked individually. You can unlock and edit before final submission.</p>
                </div>
              </div>
              <div className="d-step">
                <div className="d-step__circle"><CheckCircle size={16} /></div>
                <div className="d-step__connector d-step__connector--end" />
                <div className="d-step__content">
                  <h4 className="d-step__title">Submit All at Once</h4>
                  <p className="d-step__desc">Once all subjects are locked, review your responses and submit everything together.</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <DashboardCard>
            <SectionHeader icon={Target} title="Guidelines" />
            <div className="d-guidelines">
              <div className="d-guideline">
                <div className="d-guideline__icon"><MessageSquare size={16} /></div>
                <div className="d-guideline__content">
                  <h4 className="d-guideline__title">Be Honest</h4>
                  <p className="d-guideline__desc">Your honest feedback directly helps improve teaching quality and course delivery.</p>
                </div>
              </div>
              <div className="d-guideline">
                <div className="d-guideline__icon"><Target size={16} /></div>
                <div className="d-guideline__content">
                  <h4 className="d-guideline__title">Be Constructive</h4>
                  <p className="d-guideline__desc">Mention specific aspects that worked well or areas that need improvement.</p>
                </div>
              </div>
              <div className="d-guideline">
                <div className="d-guideline__icon"><ShieldCheck size={16} /></div>
                <div className="d-guideline__content">
                  <h4 className="d-guideline__title">Stay Anonymous</h4>
                  <p className="d-guideline__desc">Your identity is never revealed to faculty. Only aggregate data is shared.</p>
                </div>
              </div>
              <div className="d-guideline">
                <div className="d-guideline__icon"><Award size={16} /></div>
                <div className="d-guideline__content">
                  <h4 className="d-guideline__title">Make a Difference</h4>
                  <p className="d-guideline__desc">This is your voice — use it genuinely to improve future sessions.</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* ── Recent Activity ── */}
      <motion.div variants={fadeUp}>
        <DashboardCard>
          <SectionHeader icon={Activity} title="Recent Activity" />
          <div className="d-activity">
            {activityItems.map((item, i) => (
              <div key={i} className="d-activity__item">
                <div className={`d-activity__icon d-activity__icon--${item.variant}`}>
                  <item.icon size={14} />
                </div>
                <div className="d-activity__content">
                  <span className="d-activity__text">{item.text}</span>
                  <span className="d-activity__date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Achievement ── */}
      {completedCount > 0 && (
        <motion.div variants={fadeUp}>
          <DashboardCard className="d-achievement">
            <div className="d-achievement__inner">
              <div className="d-achievement__icon"><Award size={28} /></div>
              <div className="d-achievement__text">
                <h4 className="d-achievement__title">Completed {completedCount}/{totalSubjects} Subjects</h4>
                <p className="d-achievement__desc">{completedCount === totalSubjects ? 'All done! Great work this session.' : `Keep going! ${remainingCount} more to go.`}</p>
              </div>
              {allotment?.open && completedCount < totalSubjects && (
                <Button size="sm" onClick={() => navigate('/feedback')}>Continue <ArrowRight size={14} /></Button>
              )}
            </div>
          </DashboardCard>
        </motion.div>
      )}
    </motion.div>
  );
};

const LockIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export default Dashboard;
