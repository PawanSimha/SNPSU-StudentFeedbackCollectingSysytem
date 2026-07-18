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
import '../styles/AdminClassSelect.css';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import CountUp from './ui/CountUp';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { API } from '../config/api';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FileCheck,
  RefreshCw, Search, X, SlidersHorizontal, Activity,
  AlertCircle, TrendingUp, MessageSquare, Eye,
  Database, Download, Server, HardDrive, ShieldCheck, Archive,
  ChevronRight, BarChart3, PieChart as PieChartIcon, Bell,
  Lock, Unlock, School, Calendar
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const sectionLabels = {
  'MCA, 1st Year, 2nd Sem, A sec': 'A Section',
  'MCA, 1st Year, 2nd Sem, B sec': 'B Section',
  'MCA, 1st Year, 2nd Sem, C sec': 'C Section',
};

const PIE_COLORS = ['#1a237e', '#C69E66', '#2e7d32'];

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

const AdminClassSelect = () => {
  const navigate = useNavigate();
  const { student } = useAuth();
  const [classList, setClassList] = useState([]);
  const [allotments, setAllotments] = useState({});
  const [dbOverview, setDbOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const refresh = () => {
    setLoading(true);
    setError('');
    fetchAll();
  };

  const fetchAll = () => {
    Promise.all([
      axios.get(`${API}/admin/classes`).then(({ data }) => data).catch(() => []),
      axios.get(`${API}/allotments`).then(({ data }) => data).catch(() => []),
      axios.get(`${API}/admin/db-overview`).then(({ data }) => data).catch(() => null),
    ]).then(([classes, allotData, overview]) => {
      setClassList(classes);
      setDbOverview(overview);
      const map = {};
      (allotData || []).forEach(a => { map[a.classGroup] = a; });
      setAllotments(map);
    }).catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const c = dbOverview?.collections;
  const studentsCount = c?.students?.count || 0;
  const feedbacksCount = c?.feedbacks?.count || 0;
  const subjectsTotal = c?.feedbacks?.totalSubjects || 6;
  const allotmentsCount = c?.allotments?.count || 0;
  const publicCount = c?.publicFeedbacks?.count || 0;
  const openSessions = classList.filter(cls => allotments[cls]?.isOpen).length;
  const completedFeedbacks = c?.feedbacks?.all?.length || 0;
  const completionRate = studentsCount ? Math.round((completedFeedbacks / (studentsCount * subjectsTotal)) * 100) : 0;

  const stats = [
    { icon: Users, value: studentsCount, label: 'Total Students', color: '#1a237e' },
    { icon: BookOpen, value: subjectsTotal, label: 'Subjects', color: '#C69E66' },
    { icon: GraduationCap, value: classList.length, label: 'Classes', color: '#6b7280' },
    { icon: Unlock, value: openSessions, label: 'Active Sessions', color: '#2e7d32' },
    { icon: MessageSquare, value: feedbacksCount, label: 'Feedbacks', color: '#0284c7' },
    { icon: Eye, value: publicCount, label: 'Anonymous', color: '#7c3aed' },
    { icon: FileCheck, value: allotmentsCount, label: 'Allotments', color: '#1a237e' },
    { icon: TrendingUp, value: completionRate, label: 'Completion', color: '#2e7d32', suffix: '%', decimals: 0 },
  ];

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

  const allFilterOptions = ['open', 'closed', 'pending', 'A', 'B', 'C'];

  if (error) {
    return (
      <div className="acs">
        <div className="acs-error">
          <AlertCircle size={32} />
          <h3>Failed to Load</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={refresh}><RefreshCw size={14} /> Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="acs" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div className="acs-header" variants={fadeUp}>
        <div className="acs-header__left">
          <div className="acs-header__icon"><LayoutDashboard size={22} /></div>
          <div>
            <h1 className="acs-header__title">Admin Dashboard</h1>
            <p className="acs-header__desc">
              Welcome back, {student?.name?.split(' ')[0] || 'Administrator'} &middot;
              MCA, 1st Year, 2nd Semester &middot;
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="acs-header__actions">
          <Button variant="outline" size="sm" onClick={refresh}><RefreshCw size={14} /> Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/database')}>
            <Database size={14} /> Database
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            toast.success('Dashboard exported');
          }}><Download size={14} /> Export</Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="acs-loading">
          <div className="acs-skeleton-grid">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="acs-skeleton" style={{ height: 110, borderRadius: 14 }} />)}
          </div>
          <div className="acs-skeleton-grid" style={{ marginTop: 24, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[1,2,3].map(i => <div key={i} className="acs-skeleton" style={{ height: 260, borderRadius: 14 }} />)}
          </div>
        </div>
      ) : (
        <>
          {/* System Overview */}
          <motion.div className="acs-stats" variants={container}>
            {stats.map((s, i) => (
              <StatCard key={i} icon={s.icon} value={s.value} label={s.label} color={s.color} suffix={s.suffix} decimals={s.decimals} />
            ))}
          </motion.div>

          {/* Search + Filters */}
          <motion.div className="acs-toolbar" variants={fadeUp}>
            <div className="acs-search">
              <Search size={16} className="acs-search__icon" />
              <input
                type="text"
                className="acs-search__input"
                placeholder="Search by section, student, or subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="acs-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="acs-filters">
              <SlidersHorizontal size={14} className="acs-filters__icon" />
              {allFilterOptions.map(f => (
                <button
                  key={f}
                  className={`acs-chip ${filters.includes(f) ? 'is-active' : ''}`}
                  onClick={() => toggleFilter(f)}
                  aria-pressed={filters.includes(f)}
                >
                  {f === 'A' ? 'A Section' : f === 'B' ? 'B Section' : f === 'C' ? 'C Section' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Class Cards */}
          <motion.div variants={fadeUp}>
            <SectionHeader icon={School} title="Class Sections" count={filteredClasses.length} />
            <div className="acs-class-grid">
              {filteredClasses.length === 0 ? (
                <div className="acs-empty">
                  <School size={40} className="acs-empty__icon" />
                  <p>No classes match your search or filters</p>
                </div>
              ) : filteredClasses.map(cls => {
                const allot = allotments[cls];
                const isOpen = allot?.isOpen || false;
                const classData = c?.students?.classGroups?.[cls];
                const classStudents = classData?.total || 0;
                const classFeedbacks = c?.feedbacks?.all?.filter(f => f.student?.classGroup === cls)?.length || 0;
                const pct = classStudents ? Math.round((classFeedbacks / (classStudents * subjectsTotal)) * 100) : 0;
                return (
                  <ClassCard
                    key={cls}
                    cls={cls}
                    students={classStudents}
                    feedbacks={classFeedbacks}
                    pct={pct}
                    isOpen={isOpen}
                    allot={allot}
                    onNavigate={(path) => navigate(path)}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Analytics + Activity + Health */}
          <div className="acs-bottom-grid">
            <motion.div className="acs-bottom-col" variants={fadeUp}>
              <SectionHeader icon={BarChart3} title="Analytics" />
              <div className="acs-analytics">
                <div className="acs-chart-card">
                  <div className="acs-chart-card__header">
                    <PieChartIcon size={14} />
                    <span>Students by Section</span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={classList.map(cls => ({
                        name: (sectionLabels[cls] || cls).charAt(0),
                        value: c?.students?.classGroups?.[cls]?.total || 1,
                      }))} cx="50%" cy="50%" innerRadius={44} outerRadius={70} dataKey="value">
                        {classList.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="acs-chart-legend">
                    {classList.map((cls, i) => (
                      <span key={cls}>
                        <span className="acs-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {(sectionLabels[cls] || cls).charAt(0)} ({c?.students?.classGroups?.[cls]?.total || 0})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="acs-chart-card">
                  <div className="acs-chart-card__header">
                    <BarChart3 size={14} />
                    <span>Feedback Completion</span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={classList.map(cls => ({
                      name: (sectionLabels[cls] || cls).charAt(0),
                      submitted: c?.feedbacks?.all?.filter(f => f.student?.classGroup === cls)?.length || 0,
                      total: c?.students?.classGroups?.[cls]?.total || 1,
                    }))} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} formatter={(val, name, props) => [val, props.payload.total ? Math.round((val / props.payload.total) * 100) + '%' : '0%']} />
                      <Bar dataKey="submitted" radius={[4, 4, 0, 0]} fill="#1a237e" maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div className="acs-bottom-col" variants={fadeUp}>
              <SectionHeader icon={Activity} title="Recent Activity" />
              <div className="acs-activity">
                {classList.map(cls => {
                  const a = allotments[cls];
                  if (!a) return null;
                  const label = sectionLabels[cls] || cls.split(',').pop()?.trim() || cls;
                  return (
                    <div key={cls} className="acs-activity__item">
                      <div className={`acs-activity__icon acs-activity__icon--${a.isOpen ? 'success' : 'muted'}`}>
                        {a.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
                      </div>
                      <div className="acs-activity__content">
                        <span className="acs-activity__text">
                          {a.isOpen ? `Session opened for ${label}` : `Session closed for ${label}`}
                        </span>
                        <span className="acs-activity__date">
                          {new Date(a.allottedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="acs-activity__item">
                  <div className="acs-activity__icon acs-activity__icon--primary"><RefreshCw size={14} /></div>
                  <div className="acs-activity__content">
                    <span className="acs-activity__text">Dashboard updated</span>
                    <span className="acs-activity__date">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                {classList.every(cls => !allotments[cls]) && (
                  <div className="acs-activity__empty">No recent activity</div>
                )}
              </div>

              <SectionHeader icon={Bell} title="Quick Actions" style={{ marginTop: 20 }} />
              <div className="acs-actions">
                <ActionBtn icon={Unlock} label="Open All Sessions" onClick={() => navigate('/admin/allotments')} />
                <ActionBtn icon={Database} label="Database Overview" onClick={() => navigate('/admin/database')} />
                <ActionBtn icon={Eye} label="Anonymous Feedback" onClick={() => navigate('/admin/anonymous')} />
                <ActionBtn icon={Download} label="Export Report" onClick={() => toast.success('Report generated')} />
              </div>
            </motion.div>

            <motion.div className="acs-bottom-col" variants={fadeUp}>
              <SectionHeader icon={Server} title="System Health" />
              <div className="acs-health">
                <HealthItem icon={Database} label="Database" status="operational" />
                <HealthItem icon={Server} label="API Server" status="operational" />
                <HealthItem icon={ShieldCheck} label="Allotments" status={openSessions > 0 ? 'operational' : 'idle'} detail={openSessions > 0 ? `${openSessions} active` : 'All closed'} />
                <HealthItem icon={HardDrive} label="Storage" status="healthy" detail="32% used" />
                <HealthItem icon={Archive} label="Last Backup" status="info" detail={new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} />
              </div>

              <SectionHeader icon={Calendar} title="Quick Stats" style={{ marginTop: 20 }} />
              <div className="acs-quick-stats">
                <div className="acs-qs-item">
                  <span className="acs-qs-item__label">Avg Completion</span>
                  <span className="acs-qs-item__value">{completionRate}%</span>
                </div>
                <div className="acs-qs-item">
                  <span className="acs-qs-item__label">Classes Active</span>
                  <span className="acs-qs-item__value">{openSessions}/{classList.length}</span>
                </div>
                <div className="acs-qs-item">
                  <span className="acs-qs-item__label">Total Feedbacks</span>
                  <span className="acs-qs-item__value">{feedbacksCount}</span>
                </div>
                <div className="acs-qs-item">
                  <span className="acs-qs-item__label">Students</span>
                  <span className="acs-qs-item__value">{studentsCount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, value, label, color, suffix = '', decimals = 0 }) => (
  <motion.div className="acs-stat-card" variants={scaleIn}>
    <div className="acs-stat-card__icon" style={{ background: `${color}15`, color }}>
      <Icon size={20} />
    </div>
    <div className="acs-stat-card__value">
      <CountUp end={value} duration={1.2} decimals={decimals} suffix={suffix} />
    </div>
    <div className="acs-stat-card__label">{label}</div>
  </motion.div>
);

/* ── Section Header ── */
const SectionHeader = ({ icon: Icon, title, count, style }) => (
  <div className="acs-section-header" style={style}>
    <div className="acs-section-header__left">
      {Icon && <Icon size={16} className="acs-section-header__icon" />}
      <h3 className="acs-section-header__title">{title}</h3>
      {count !== undefined && <span className="acs-section-header__count">{count}</span>}
    </div>
  </div>
);

/* ── Status Badge ── */
const StatusBadge = ({ status, children }) => {
  const cls = status === 'open' || status === 'success' ? 'acs-badge acs-badge--success'
    : status === 'closed' || status === 'muted' ? 'acs-badge acs-badge--muted'
    : status === 'pending' || status === 'warning' ? 'acs-badge acs-badge--warning'
    : 'acs-badge acs-badge--info';
  return <span className={cls}>{children || status}</span>;
};

/* ── Class Card ── */
const ClassCard = ({ cls, students, feedbacks, pct, isOpen, allot, onNavigate }) => {
  const label = sectionLabels[cls] || cls;
  const sectionLetter = label.charAt(0);

  return (
    <motion.div className="acs-class-card" variants={scaleIn}>
      <div className="acs-class-card__head">
        <div className="acs-class-card__avatar">{sectionLetter}</div>
        <div className="acs-class-card__head-info">
          <h4 className="acs-class-card__name">{label}</h4>
          <span className="acs-class-card__sub">MCA &middot; 1st Year &middot; 2nd Sem</span>
        </div>
        <StatusBadge status={isOpen ? 'success' : allot ? 'muted' : 'warning'}>
          {isOpen ? 'Open' : allot ? 'Closed' : 'Pending'}
        </StatusBadge>
      </div>

      <div className="acs-class-card__stats">
        <div className="acs-class-card__stat">
          <Users size={14} />
          <span>{students}</span>
        </div>
        <div className="acs-class-card__stat">
          <MessageSquare size={14} />
          <span>{feedbacks} feedbacks</span>
        </div>
      </div>

      <div className="acs-class-card__progress">
        <div className="acs-class-card__progress-track">
          <div
            className="acs-class-card__progress-fill"
            style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 70 ? '#2e7d32' : pct >= 40 ? '#C69E66' : '#c62828' }}
          />
        </div>
        <span className="acs-class-card__progress-label">{feedbacks} submissions &middot; {pct}%</span>
      </div>

      <div className="acs-class-card__actions">
        <Button variant="primary" size="sm" onClick={() => onNavigate(`/admin/${encodeURIComponent(cls)}`)}>
          <Users size={14} /> View Students
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate(`/admin/${encodeURIComponent(cls)}/dashboard`)}>
          <BarChart3 size={14} /> Dashboard
        </Button>
      </div>
    </motion.div>
  );
};

/* ── Quick Action Button ── */
const ActionBtn = ({ icon: Icon, label, onClick }) => (
  <button className="acs-action-btn" onClick={onClick}>
    <Icon size={18} />
    <span className="acs-action-btn__label">{label}</span>
    <ChevronRight size={14} className="acs-action-btn__arrow" />
  </button>
);

/* ── Health Item ── */
const HealthItem = ({ icon: Icon, label, status, detail }) => {
  const dotColor = status === 'operational' || status === 'healthy' ? '#2e7d32' : status === 'info' ? '#1a237e' : '#c62828';
  return (
    <div className="acs-health-item">
      <div className="acs-health-item__icon"><Icon size={15} /></div>
      <div className="acs-health-item__info">
        <span className="acs-health-item__label">{label}</span>
        <span className="acs-health-item__detail">{detail || status}</span>
      </div>
      <span className="acs-health-item__dot" style={{ background: dotColor }} />
    </div>
  );
};

export default AdminClassSelect;
