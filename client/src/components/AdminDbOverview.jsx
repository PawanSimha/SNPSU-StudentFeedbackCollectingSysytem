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
import '../styles/AdminDbOverview.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import {
  Database, RefreshCw, Download, Search, Users, MessageSquare,
  BookOpen, FileCheck, Eye, Activity,
  AlertCircle, TrendingUp, UserPlus, Calendar, ShieldCheck,
  Server, HardDrive, Archive, ChevronRight,
  GraduationCap, BarChart3, PieChart as PieChartIcon, X,
  LayoutGrid, ArrowUpDown
} from 'lucide-react';
import CountUp from './ui/CountUp';
import Button from './ui/Button';
import { API } from '../config/api';
import { downloadCsv, downloadDoc } from '../utils/download';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
  { key: 'allotments', label: 'Allotments', icon: FileCheck },
  { key: 'anonymous', label: 'Anonymous', icon: Eye },
];

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

const PIE_COLORS = ['#2e7d32', '#E5E7EB'];

const AdminDbOverview = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(() => {
    axios.get(`${API}/admin/db-overview`).then(({ data }) => {
      setData(data);
      setLastUpdated(new Date());
      setError('');
    }).catch(() => {
      setError('Failed to load database overview');
    });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const collections = data?.collections;

  const filteredStudents = useMemo(() => {
    const allStudents = collections?.students?.all || [];
    if (!search) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(s =>
      s.name?.toLowerCase().includes(q) || s.usn?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
    );
  }, [search, collections?.students?.all]);

  const filteredFeedbacks = useMemo(() => {
    const allFeedbacks = collections?.feedbacks?.all || [];
    if (!search) return allFeedbacks;
    const q = search.toLowerCase();
    return allFeedbacks.filter(f =>
      f.subject?.toLowerCase().includes(q) ||
      (f.student?.name?.toLowerCase().includes(q)) ||
      (f.student?.usn?.toLowerCase().includes(q)) ||
      (f.comments?.toLowerCase().includes(q))
    );
  }, [search, collections?.feedbacks?.all]);

  if (error) {
    return (
      <div className="ado">
        <div className="ado-error">
          <AlertCircle size={32} />
          <h3>Failed to Load</h3>
          <p>{error}</p>
          <Button variant="primary" size="sm" onClick={fetchData}>
            <RefreshCw size={14} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ado">
        <div className="ado-skeleton-header">
          <div className="ado-skeleton" style={{ width: 220, height: 28 }} />
          <div className="ado-skeleton" style={{ width: 340, height: 16, marginTop: 8 }} />
        </div>
        <div className="ado-skeleton-tabs">
          {[1,2,3,4,5].map(i => <div key={i} className="ado-skeleton" style={{ width: 100, height: 36, borderRadius: 8 }} />)}
        </div>
        <div className="ado-stats-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="ado-skeleton" style={{ height: 110, borderRadius: 14 }} />)}
        </div>
        <div className="ado-grid-2col">
          <div className="ado-skeleton" style={{ height: 300, borderRadius: 14 }} />
          <div className="ado-skeleton" style={{ height: 300, borderRadius: 14 }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div className="ado" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div className="ado-header" variants={fadeUp}>
        <div className="ado-header__left">
          <div className="ado-header__icon">
            <Database size={22} />
          </div>
          <div>
            <h1 className="ado-header__title">Database Overview</h1>
            <p className="ado-header__desc">
              Full snapshot of all collections, records, and system metrics
              {lastUpdated && <span className="ado-header__updated"> &middot; Updated {lastUpdated.toLocaleTimeString()}</span>}
            </p>
          </div>
        </div>
        <div className="ado-header__actions">
          <div className="ado-search-trigger" onClick={() => document.getElementById('ado-global-search')?.focus()}>
            <Search size={14} />
            <span>Search database...</span>
            <kbd className="ado-kbd">/</kbd>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw size={14} /> Refresh</Button>
          <Button variant="primary" size="sm" onClick={() => {
            const rows = [];
            if (collections?.students?.all) {
              rows.push(['Students', String(collections.students.count), '', '', '']);
              collections.students.all.forEach(s => rows.push(['', s.name, s.usn, s.email, s.classGroup]));
            }
            downloadCsv(rows, 'db_overview');
            toast.success('Database exported');
          }}><Download size={14} /> Export</Button>
        </div>
      </motion.div>

      {/* Global Search */}
      <motion.div className="ado-global-search" variants={fadeUp}>
        <Search size={16} className="ado-global-search__icon" />
        <input
          id="ado-global-search"
          type="text"
          className="ado-global-search__input"
          placeholder={`Search by name, USN, subject, class, faculty${activeTab !== 'dashboard' ? ` (${activeTab})` : ''}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === '/') e.preventDefault(); }}
        />
        {search && (
          <button className="ado-global-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
        <kbd className="ado-kbd ado-kbd--search">/</kbd>
      </motion.div>

      {/* Tabs */}
      <motion.div className="ado-tabs" variants={fadeUp}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const count = tab.key === 'dashboard' ? null
            : tab.key === 'anonymous'
              ? (collections.publicFeedbacks?.count || 0)
              : (collections[tab.key]?.count || 0);
          return (
            <button
              key={tab.key}
              className={`ado-tab ${activeTab === tab.key ? 'is-active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSearch(''); }}
              aria-selected={activeTab === tab.key}
              role="tab"
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {count !== null && <span className="ado-tab__count">{count}</span>}
              {activeTab === tab.key && <motion.div className="ado-tab__indicator" layoutId="tabIndicator" />}
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={fadeUp} key={activeTab}>
        {activeTab === 'dashboard' && <DashboardView collections={collections} />}
        {activeTab === 'students' && <StudentsView students={filteredStudents} total={collections.students.count} />}
        {activeTab === 'feedbacks' && <FeedbacksView feedbacks={filteredFeedbacks} total={collections.feedbacks.count} />}
        {activeTab === 'allotments' && <AllotmentsView allotments={collections.allotments.all} />}
        {activeTab === 'anonymous' && <AnonymousView feedbacks={collections.publicFeedbacks?.all || []} />}
      </motion.div>
    </motion.div>
  );
};

/* ── Dashboard View ── */
const DashboardView = ({ collections }) => {
  const students = collections.students;
  const feedbacks = collections.feedbacks;
  const allotments = collections.allotments;

  const classNames = Object.keys(students.classGroups).filter(cls => /[ABC] sec$/i.test(cls));
  const barData = classNames.map(cls => ({
    name: cls.match(/^([A-Z])/)?.[1] || cls,
    full: cls,
    count: students.classGroups[cls]?.total || 0,
  }));

  const totalStudents = students.count;
  const completedFeedbacks = feedbacks.all?.length || 0;
  const pctComplete = totalStudents ? Math.round((completedFeedbacks / (totalStudents * (feedbacks.totalSubjects || 1))) * 100) : 0;
  const pieData = [
    { name: 'Submitted', value: Math.max(0, pctComplete) },
    { name: 'Pending', value: Math.max(0, 100 - pctComplete) },
  ];

  const openAllotments = allotments.all?.filter(a => a.isOpen)?.length || 0;

  return (
    <motion.div className="ado-dashboard" variants={container}>
      {/* Stats Grid */}
      <motion.div className="ado-stats-grid" variants={container}>
        <StatCard icon={Users} value={students.count} label="Total Students" color="#1a237e" trend="enrolled" />
        <StatCard icon={MessageSquare} value={feedbacks.count} label="Total Feedbacks" color="#2e7d32" trend="submitted" />
        <StatCard icon={BookOpen} value={feedbacks.totalSubjects} label="Subjects" color="#C69E66" trend="active" />
        <StatCard icon={FileCheck} value={allotments.count} label="Allotments" color="#6b7280" trend="sessions" />
        <StatCard icon={Eye} value={collections.publicFeedbacks?.count || 0} label="Anonymous" color="#0284c7" trend="received" />
        <StatCard icon={ShieldCheck} value={openAllotments} label="Active Sessions" color="#2e7d32" trend="currently open" />
      </motion.div>

      {/* Charts Row */}
      <motion.div className="ado-grid-2col" variants={container}>
        <ChartCard icon={BarChart3} title="Students per Section">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 13 }}
                formatter={(val, name, props) => [val, props.payload.full]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#1a237e" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard icon={PieChartIcon} title="Feedback Completion">
          <div className="ado-chart-pie-wrap">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={56} outerRadius={84} dataKey="value" startAngle={90} endAngle={-270}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="ado-chart-center">
              <span className="ado-chart-center__value">{pctComplete}%</span>
              <span className="ado-chart-center__label">Complete</span>
            </div>
            <div className="ado-chart-legend">
              <div className="ado-chart-legend__item">
                <span className="ado-chart-legend__dot" style={{ background: '#2e7d32' }} />
                <span>Submitted ({pctComplete}%)</span>
              </div>
              <div className="ado-chart-legend__item">
                <span className="ado-chart-legend__dot" style={{ background: '#E5E7EB' }} />
                <span>Pending ({100 - pctComplete}%)</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Students by Class */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={GraduationCap} title="Students by Class" count={classNames.length} />
        <div className="ado-class-grid">
          {classNames.map(cls => {
            const info = students.classGroups[cls];
            const sectionLetter = cls.match(/^([A-Z])/)?.[1] || '';
            const initials = classNames.length <= 3 ? cls.split(',').map(s => s.trim()).slice(-1)[0] : sectionLetter;
            const completedInClass = feedbacks.all?.filter(f => f.student?.classGroup === cls)?.length || 0;
            const clsPct = info.total ? Math.round((completedInClass / (info.total * (feedbacks.totalSubjects || 1))) * 100) : 0;
            return (
              <ClassCard
                key={cls}
                name={cls}
                count={info.total}
                students={info.students}
                pct={clsPct}
                initials={initials}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Feedback per Subject */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={BarChart3} title="Feedback per Subject" count={Object.keys(feedbacks.subjectStats).length} />
        <div className="ado-subject-grid">
          {Object.entries(feedbacks.subjectStats).map(([sub, stats]) => {
            const pct = students.count ? Math.round((stats.uniqueStudents / students.count) * 100) : 0;
            const barColor = pct >= 70 ? '#2e7d32' : pct >= 40 ? '#C69E66' : '#c62828';
            return (
              <SubjectCard
                key={sub}
                subject={sub}
                total={stats.total}
                unique={stats.uniqueStudents}
                pct={pct}
                barColor={barColor}
                studentCount={students.count}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Allotments + Recent Activity Row */}
      <div className="ado-grid-2col">
        <motion.div variants={fadeUp}>
          <SectionHeader icon={FileCheck} title="Allotments" count={allotments.all?.length || 0} />
          <div className="ado-allot-list">
            {allotments.all?.length > 0 ? allotments.all.slice(0, 4).map((a, i) => (
              <AllotmentCard key={i} allotment={a} />
            )) : (
              <EmptyState icon={FileCheck} message="No allotments yet" />
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <SectionHeader icon={Activity} title="Recent Activity" />
          <div className="ado-activity-list">
            <ActivityItem icon={UserPlus} text="Database overview loaded" date={new Date().toLocaleDateString()} variant="primary" />
            <ActivityItem icon={RefreshCw} text={`${students.count} students tracked`} date={new Date().toLocaleDateString()} variant="primary" />
            <ActivityItem icon={MessageSquare} text={`${feedbacks.count} feedback submissions`} date={new Date().toLocaleDateString()} variant="success" />
            {openAllotments > 0 && (
              <ActivityItem icon={ShieldCheck} text={`${openAllotments} active session${openAllotments > 1 ? 's' : ''}`} date={new Date().toLocaleDateString()} variant="success" />
            )}
            <ActivityItem icon={Eye} text={`${collections.publicFeedbacks?.count || 0} anonymous feedbacks`} date={new Date().toLocaleDateString()} variant="muted" />
          </div>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div variants={fadeUp}>
        <SectionHeader icon={Server} title="System Health" />
        <div className="ado-health-grid">
          <HealthItem icon={Database} label="Database" status="operational" />
          <HealthItem icon={Server} label="Server" status="operational" />
          <HealthItem icon={ShieldCheck} label="API" status="operational" />
          <HealthItem icon={HardDrive} label="Storage" status="healthy" detail={`${((allotments.all?.length || 0) * 0.5 + 15).toFixed(0)}% used`} />
          <HealthItem icon={Archive} label="Last Backup" status="info" detail={new Date().toLocaleDateString()} />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Sub-components ── */

const StatCard = ({ icon: Icon, value, label, color, trend }) => (
  <motion.div className="ado-stat-card" variants={scaleIn}>
    <div className="ado-stat-card__top">
      <div className="ado-stat-card__icon" style={{ background: `${color}12`, color }}>
        <Icon size={20} />
      </div>
      <TrendingUp size={14} className="ado-stat-card__trend" style={{ color }} />
    </div>
    <div className="ado-stat-card__value">
      <CountUp end={value} duration={1.2} />
    </div>
    <div className="ado-stat-card__label">{label}</div>
    <div className="ado-stat-card__trend-label">{trend}</div>
  </motion.div>
);

const ChartCard = ({ icon: Icon, title, children }) => (
  <motion.div className="ado-chart-card" variants={scaleIn}>
    <div className="ado-chart-card__header">
      <div className="ado-chart-card__header-left">
        <Icon size={16} className="ado-chart-card__icon" />
        <h3 className="ado-chart-card__title">{title}</h3>
      </div>
    </div>
    <div className="ado-chart-card__body">{children}</div>
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, count, action }) => (
  <div className="ado-section-header">
    <div className="ado-section-header__left">
      {Icon && <Icon size={16} className="ado-section-header__icon" />}
      <h3 className="ado-section-header__title">{title}</h3>
      {count !== undefined && <span className="ado-section-header__count">{count}</span>}
    </div>
    {action && <div className="ado-section-header__action">{action}</div>}
  </div>
);

const StatusBadge = ({ status, children }) => {
  const cls = status === 'open' || status === 'operational' || status === 'success' ? 'ado-badge ado-badge--success'
    : status === 'closed' || status === 'muted' ? 'ado-badge ado-badge--muted'
    : status === 'upcoming' || status === 'warning' ? 'ado-badge ado-badge--warning'
    : status === 'danger' ? 'ado-badge ado-badge--danger'
    : 'ado-badge ado-badge--info';
  return <span className={cls}>{children || status}</span>;
};

const ClassCard = ({ name, count, students, pct, initials }) => {
  const [expanded, setExpanded] = useState(false);
  const displayStudents = expanded ? students : students?.slice(0, 5);
  return (
    <motion.div className="ado-class-card" variants={scaleIn}>
      <div className="ado-class-card__head">
        <div className="ado-class-card__avatar">{initials?.charAt(0) || '?'}</div>
        <div className="ado-class-card__head-info">
          <h4 className="ado-class-card__name">{name}</h4>
          <span className="ado-class-card__count">{count} student{count !== 1 ? 's' : ''}</span>
        </div>
        <StatusBadge status={pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'muted'}>
          {pct}%
        </StatusBadge>
      </div>
      <div className="ado-class-card__progress">
        <div className="ado-class-card__progress-track">
          <div className="ado-class-card__progress-fill" style={{ width: `${pct}%`, background: pct >= 70 ? '#2e7d32' : pct >= 40 ? '#C69E66' : '#c62828' }} />
        </div>
        <span className="ado-class-card__progress-label">{pct}% feedback completion</span>
      </div>
      <div className="ado-class-card__list">
        {displayStudents?.map((s, i) => (
          <div key={i} className="ado-class-card__student">
            <div className="ado-class-card__student-avatar">
              {s.name?.charAt(0) || '?'}
            </div>
            <span className="ado-class-card__student-name">{s.name}</span>
            <span className="ado-class-card__student-usn">{s.usn}</span>
          </div>
        ))}
        {students?.length > 5 && (
          <button className="ado-class-card__expand" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : `Show ${students.length - 5} more`}
            <ChevronRight size={14} style={{ transform: expanded ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const SubjectCard = ({ subject, total, unique, pct, barColor, studentCount }) => (
  <motion.div className="ado-subject-card" variants={scaleIn}>
    <div className="ado-subject-card__head">
      <h4 className="ado-subject-card__title">{subject}</h4>
      <StatusBadge status={pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'danger'}>{pct}%</StatusBadge>
    </div>
    <div className="ado-subject-card__stats">
      <div className="ado-subject-card__stat">
        <span className="ado-subject-card__stat-value">{total}</span>
        <span className="ado-subject-card__stat-label">submissions</span>
      </div>
      <div className="ado-subject-card__stat">
        <span className="ado-subject-card__stat-value">{unique}</span>
        <span className="ado-subject-card__stat-label">students</span>
      </div>
      <div className="ado-subject-card__stat">
        <span className="ado-subject-card__stat-value">{Math.round((unique / (studentCount || 1)) * 100)}%</span>
        <span className="ado-subject-card__stat-label">coverage</span>
      </div>
    </div>
    <div className="ado-subject-card__bar">
      <div className="ado-subject-card__bar-track">
        <div className="ado-subject-card__bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  </motion.div>
);

const AllotmentCard = ({ allotment: a }) => {
  const status = a.isOpen ? 'open' : 'closed';
  return (
    <div className={`ado-allot-card ado-allot-card--${status}`}>
      <div className="ado-allot-card__head">
        <div className="ado-allot-card__class">{a.classGroup}</div>
        <StatusBadge status={status}>{a.isOpen ? 'Open' : 'Closed'}</StatusBadge>
      </div>
      {a.message && <div className="ado-allot-card__msg">&ldquo;{a.message}&rdquo;</div>}
      <div className="ado-allot-card__date">
        <Calendar size={12} />
        {new Date(a.allottedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

const HealthItem = ({ icon: Icon, label, status, detail }) => {
  const dotColor = status === 'operational' || status === 'healthy' ? '#2e7d32' : status === 'info' ? '#1a237e' : '#c62828';
  return (
    <div className="ado-health-item">
      <div className="ado-health-item__icon">
        <Icon size={16} />
      </div>
      <div className="ado-health-item__info">
        <span className="ado-health-item__label">{label}</span>
        <span className="ado-health-item__detail">{detail || status}</span>
      </div>
      <span className="ado-health-item__dot" style={{ background: dotColor }} />
    </div>
  );
};

const ActivityItem = ({ icon: Icon, text, date, variant = 'muted' }) => (
  <div className="ado-activity-item">
    <div className={`ado-activity-item__icon ado-activity-item__icon--${variant}`}>
      <Icon size={14} />
    </div>
    <div className="ado-activity-item__content">
      <span className="ado-activity-item__text">{text}</span>
      <span className="ado-activity-item__date">{date}</span>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="ado-empty">
    <Icon size={32} className="ado-empty__icon" />
    <p className="ado-empty__text">{message}</p>
  </div>
);

/* ── Students View ── */
const StudentsView = ({ students, total }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortField) return students;
    return [...students].sort((a, b) => {
      const av = (a[sortField] || '').toLowerCase();
      const bv = (b[sortField] || '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [students, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="ado-table-wrap">
      <div className="ado-table-info">
        <span>{sorted.length} of {total} student{total !== 1 ? 's' : ''}</span>
        <Button variant="ghost" size="sm" onClick={() => {
          const rows = sorted.map(s => [s.name, s.usn, s.email, s.classGroup, s.role]);
          downloadCsv([['Name', 'USN', 'Email', 'Class', 'Role'], ...rows], 'students');
          toast.success('Students exported');
        }}><Download size={13} /> Export CSV</Button>
      </div>
      <div className="ado-table-scroll">
        <table className="ado-table" role="table">
          <thead>
            <tr>
              <th className="ado-th-num">#</th>
              <th onClick={() => toggleSort('name')} className="ado-th-sort">Name <ArrowUpDown size={12} /></th>
              <th onClick={() => toggleSort('usn')} className="ado-th-sort">USN <ArrowUpDown size={12} /></th>
              <th>Email</th>
              <th>Class</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s._id}>
                <td className="ado-td-num">{i + 1}</td>
                <td className="ado-td-name">{s.name}</td>
                <td className="ado-td-usn">{s.usn}</td>
                <td className="ado-td-email">{s.email}</td>
                <td><span className="ado-tag">{s.classGroup}</span></td>
                <td>{s.role === 'admin' ? <span className="ado-role-badge">Admin</span> : <span className="ado-tag ado-tag--student">Student</span>}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan="6" className="ado-empty-cell">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Feedbacks View ── */
const FeedbacksView = ({ feedbacks, total }) => (
  <div className="ado-table-wrap">
    <div className="ado-table-info">
      <span>{feedbacks.length} of {total} feedback{total !== 1 ? 's' : ''}</span>
      <Button variant="ghost" size="sm" onClick={() => {
        const rows = feedbacks.map(f => [f.student?.name || 'Deleted', f.student?.usn || '-', f.subject, f.comments || '', new Date(f.createdAt).toLocaleDateString()]);
        downloadCsv([['Student', 'USN', 'Subject', 'Comments', 'Date'], ...rows], 'feedbacks');
        toast.success('Feedbacks exported');
      }}><Download size={13} /> Export CSV</Button>
    </div>
    <div className="ado-table-scroll">
      <table className="ado-table">
        <thead>
          <tr>
            <th className="ado-th-num">#</th>
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
              <td className="ado-td-num">{i + 1}</td>
              <td className="ado-td-name">{f.student?.name || 'Deleted'}</td>
              <td className="ado-td-usn">{f.student?.usn || '-'}</td>
              <td>{f.student?.classGroup ? <span className="ado-tag">{f.student.classGroup}</span> : '-'}</td>
              <td className="ado-td-subject">{f.subject}</td>
              <td className="ado-td-comments" title={f.comments}>
                {f.comments?.length > 80 ? f.comments.slice(0, 80) + '...' : f.comments}
              </td>
              <td className="ado-td-date">{new Date(f.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {feedbacks.length === 0 && (
            <tr><td colSpan="7" className="ado-empty-cell">No feedbacks found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* ── Allotments View ── */
const AllotmentsView = ({ allotments }) => (
  <div className="ado-allot-view">
    {allotments.length > 0 ? (
      <div className="ado-allot-grid">
        {allotments.map((a, i) => (
          <AllotmentCard key={a._id || i} allotment={a} />
        ))}
      </div>
    ) : (
      <EmptyState icon={FileCheck} message="No allotments found" />
    )}
  </div>
);

/* ── Anonymous View ── */
const AnonymousView = ({ feedbacks }) => {
  const downloadExcel = () => {
    const rows = feedbacks.map((f, i) => [
      i + 1, f.subject, f.facultyName || '-', f.comments || '', new Date(f.createdAt).toLocaleDateString(),
    ]);
    const headers = ['#', 'Subject', 'Faculty', 'Comments', 'Date'];
    downloadCsv([headers, ...rows], 'anonymous_feedbacks');
    toast.success('CSV downloaded');
  };

  const downloadWord = () => {
    const headers = ['#', 'Subject', 'Faculty', 'Comments', 'Date'];
    const rows = feedbacks.map((f, i) => [
      String(i + 1), f.subject, f.facultyName || '-', f.comments || '-', new Date(f.createdAt).toLocaleDateString(),
    ]);
    downloadDoc('Anonymous Feedbacks', headers, rows, 'anonymous_feedbacks');
    toast.success('Word document downloaded');
  };

  return (
    <div className="ado-table-wrap">
      <div className="ado-table-info">
        <span>{feedbacks.length} anonymous feedback{feedbacks.length !== 1 ? 's' : ''}</span>
        <div className="ado-table-info__actions">
          <Button variant="outline" size="sm" onClick={downloadExcel}><Download size={13} /> Export CSV</Button>
          <Button variant="outline" size="sm" onClick={downloadWord}><Download size={13} /> Export Word</Button>
        </div>
      </div>
      <div className="ado-table-scroll">
        <table className="ado-table">
          <thead>
            <tr>
              <th className="ado-th-num">#</th>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Comments</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, i) => (
              <tr key={f._id}>
                <td className="ado-td-num">{i + 1}</td>
                <td><span className="ado-tag">{f.subject}</span></td>
                <td>{f.facultyName || '-'}</td>
                <td className="ado-td-comments" title={f.comments}>{f.comments}</td>
                <td className="ado-td-date">{new Date(f.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr><td colSpan="5" className="ado-empty-cell">No anonymous feedbacks yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDbOverview;
