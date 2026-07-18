import '../styles/Landing.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from './ui/CountUp';
import { Helmet } from 'react-helmet-async';
import {
  Target, Clock, Shield, ArrowRight, ChevronDown,
  MessageSquare, BarChart3, ShieldCheck, Users,
  BookOpen, Award
} from 'lucide-react';
import Button from './ui/Button';
import Navbar from './Navbar';
import Footer from './Footer';

const StatItem = ({ icon: Icon, num, suffix, label, decimals }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  return (
    <div className="landing-stat" ref={ref}>
      <Icon size={28} className="landing-stat__icon" />
      <span className="landing-stat__num">
        {inView ? <CountUp start={0} end={num} duration={2} decimals={decimals} /> : 0}{suffix}
      </span>
      <span className="landing-stat__label">{label}</span>
    </div>
  );
};

const FAQ_ITEMS = [
  {
    q: 'What is the Feedback Collector?',
    a: 'Feedback Collector is a digital platform by the Department of CSE, Sapthagiri NPS University, that allows students to submit anonymous feedback on courses and instructors after each class session. Faculty and administrators can view aggregated insights to drive continuous improvement.',
  },
  {
    q: 'Who can use this platform?',
    a: 'The platform is available for all students enrolled in the MCA programme. Administrators have dashboard access to manage allotments, view feedback reports, and export data.',
  },
  {
    q: 'Is my feedback anonymous?',
    a: 'Yes, all feedback submissions are anonymous to instructors. Only the administrator can see your identity for coverage tracking. Your name, USN, and email are never shared with faculty. Only the subject and your comments are recorded to ensure honest and unbiased responses.',
  },
  {
    q: 'How do I submit feedback?',
    a: 'After logging in with your student credentials, navigate to the Dashboard and click on "Submit Feedback" for the active subject. Write your comments and lock your response, then submit. You can submit feedback for each subject once per allotted session.',
  },
  {
    q: 'Can I view my past feedback?',
    a: 'Yes, you can view all your previously submitted feedback from the "My Feedback" section. This allows you to track what you have shared across different subjects over time.',
  },
  {
    q: 'How do administrators use the data?',
    a: 'Administrators can access aggregated feedback reports through the dashboard. They can view submission rates, subject-wise feedback, and export reports in CSV or Word format for analysis and accreditation purposes.',
  },
  {
    q: 'What if I face login issues?',
    a: 'If you are unable to log in, ensure you are using the correct email, USN, and password provided by the college. These credentials are issued to you during admission. If the problem persists, contact the department administrator or your class coordinator for assistance.',
  },
  {
    q: 'Is the platform accessible on mobile?',
    a: 'Yes, the Feedback Collector is fully responsive and works seamlessly on desktops, tablets, and mobile phones. You can submit feedback and check reports from any device with an internet connection.',
  },
];

const SectionTitle = ({ children }) => (
  <h2 className="section-title">{children}</h2>
);

const AnimatedSection = ({ children, className = '' }) => {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      initial={prefersReduced ? {} : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
};

const HowItWorksStep = ({ num, icon: Icon, title, desc, isLast }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div className="how-step" ref={ref}>
      <motion.div
        className="how-step__circle"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Icon size={22} />
        <span className="how-step__num">{num}</span>
      </motion.div>
      {!isLast && <div className="how-step__line" />}
      <motion.div
        className="how-step__content"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h3>{title}</h3>
        <p>{desc}</p>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay = 0) => prefersReduced ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease: 'easeOut' },
  };

  return (
    <main className="landing" role="main">
      <Navbar variant="landing" />
      <Helmet>
        <title>SOAS Feedback Collector - Anonymous Course Feedback for SNPSU</title>
        <meta name="description" content="Anonymous course feedback platform for MCA students at Sapthagiri NPS University. Submit per-subject feedback with session-gated allotments." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero__bg" />
        <div className="landing-hero__overlay" />
        <div className="landing-hero__content">
          <motion.span className="landing-hero__badge" {...fadeUp(0)}>
            Sapthagiri NPS University
          </motion.span>
          <motion.h1 className="landing-hero__title" {...fadeUp(0.1)}>
            Feedback Collector
          </motion.h1>
          <motion.p className="landing-hero__subtitle" {...fadeUp(0.2)}>
            A streamlined platform for students to share course feedback and for faculty to gain actionable insights, driving continuous improvement in education.
          </motion.p>
          <motion.div className="landing-hero__actions" {...fadeUp(0.3)}>
            <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
              Get Started <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
          </motion.div>
          <motion.div {...fadeUp(0.4)}>
            <Button variant="ghost" size="md" onClick={() => navigate('/feedback/public')} className="landing-hero__anonymous-btn">
              <ShieldCheck size={16} /> Give Feedback Anonymously
            </Button>
          </motion.div>
        </div>

      </section>

      {/* ── About ── */}
      <AnimatedSection className="landing-section landing-about" id="about">
        <div className="landing-section__inner landing-about__inner">
          <div className="landing-about__grid">
            <div className="landing-about__image">
              <img src="/images/about.webp" alt="Sapthagiri NPS University Campus" loading="lazy" />
            </div>
            <div className="landing-about__content">
              <SectionTitle>About Sapthagiri NPS University</SectionTitle>
              <p>
                Sapthagiri NPS University is committed to providing high-quality technical education that combines strong foundational knowledge with practical skills, ethical values and leadership qualities. Our programme prepares graduates to excel in the rapidly evolving tech industry while contributing responsibly to society.
              </p>
              <p>
                Through state-of-the-art infrastructure, innovative teaching-learning methods and a balanced focus on theory and hands-on applications, we nurture globally competent engineers capable of addressing complex computing challenges and developing sustainable, socially responsible solutions.
              </p>
              <p>
                The School of Applied Sciences (SOAS) offers a dynamic learning environment with experienced faculty, modern laboratories, and industry-aligned curricula. Students benefit from hands-on training, research opportunities, and a strong emphasis on both technical competence and professional ethics.
              </p>

              <div className="landing-about__highlights">
                <div className="highlight-card">
                  <Award size={20} />
                  <div>
                    <span className="highlight-card__num">10+</span>
                    <span className="highlight-card__label">Years of Excellence</span>
                  </div>
                </div>
                <div className="highlight-card">
                  <Users size={20} />
                  <div>
                    <span className="highlight-card__num">500+</span>
                    <span className="highlight-card__label">Students Enrolled</span>
                  </div>
                </div>
                <div className="highlight-card">
                  <BookOpen size={20} />
                  <div>
                    <span className="highlight-card__num">6+</span>
                    <span className="highlight-card__label">Programs Offered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Vision, Mission, Values ── */}
      <AnimatedSection className="landing-section landing-vmv">
        <div className="landing-section__inner">
          <div className="landing-vmv__grid">
            <div className="vmv-card">
              <div className="vmv-card__icon"><Target size={24} /></div>
              <h3>Our Vision</h3>
              <p>To empower students with deep technical knowledge, ethical values and leadership skills, enabling them to become responsible contributors to society and the tech industry.</p>
            </div>
            <div className="vmv-card">
              <div className="vmv-card__icon"><Clock size={24} /></div>
              <h3>Our Mission</h3>
              <ul>
                <li>Value-based technical education with state-of-the-art infrastructure</li>
                <li>Nurture ethical, motivated and skilled engineers</li>
                <li>Develop ability to solve problems individually and collaboratively</li>
                <li>Nurture globally competent engineers for sustainable solutions</li>
              </ul>
            </div>
            <div className="vmv-card vmv-card--wide">
              <div className="vmv-card__icon"><Shield size={24} /></div>
              <h3>Core Values</h3>
              <div className="vmv-card__tags">
                {['Technical Excellence', 'Ethics & Integrity', 'Innovation & Creativity', 'Collaboration & Teamwork', 'Lifelong Learning', 'Social Responsibility', 'Leadership'].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── How It Works ── */}
      <AnimatedSection className="landing-section landing-how" id="how-it-works">
        <div className="landing-section__inner">
          <SectionTitle>How It Works</SectionTitle>
          <div className="how-flow">
            <HowItWorksStep num={1} icon={MessageSquare} title="Submit Feedback" desc="Students can anonymously submit feedback on courses and instructors after each class session." />
            <HowItWorksStep num={2} icon={BarChart3} title="Track Progress" desc="Students can view their feedback history across all subjects and stay updated on submission deadlines." />
            <HowItWorksStep num={3} icon={Users} title="Admin Dashboard" desc="Administrators can view aggregated feedback, track submission rates, and export reports." />
            <HowItWorksStep num={4} icon={ShieldCheck} title="Anonymous Channel" desc="Anyone can submit anonymous feedback without logging in. No identity is collected." isLast />
          </div>
        </div>
      </AnimatedSection>

      {/* ── Stats ── */}
      <AnimatedSection className="landing-section landing-stats">
        <div className="landing-stats__bg" />
        <div className="landing-section__inner">
          <div className="landing-stats__grid">
            <StatItem icon={Users} num={3} suffix="+" label="Academic Sections" decimals={0} />
            <StatItem icon={BookOpen} num={6} suffix="+" label="Subjects per Sem" decimals={0} />
            <StatItem icon={ShieldCheck} num={100} suffix="%" label="Digital Workflow" decimals={0} />
            <StatItem icon={Clock} num={24} suffix="/7" label="Platform Access" decimals={0} />
          </div>
        </div>
      </AnimatedSection>

      {/* ── FAQ ── */}
      <AnimatedSection className="landing-section landing-faq" id="faq">
        <div className="landing-section__inner">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <div className="landing-faq__list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}>
                <button
                  className="faq-item__question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="faq-item__icon" />
                </button>
                <motion.div
                  id={`faq-answer-${i}`}
                  className="faq-item__answer"
                  role="region"
                  initial={false}
                  animate={{
                    height: openFaq === i ? 'auto' : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p>{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── CTA ── */}
      <AnimatedSection className="landing-section landing-cta">
        <div className="landing-cta__bg" />
        <div className="landing-section__inner">
          <h2>Ready to share your feedback?</h2>
          <p>Sign in with your student credentials or submit anonymous feedback without logging in.</p>
          <div className="landing-cta__actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
              Sign In Now <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/feedback/public')}>
              <ShieldCheck size={18} /> Give Anonymous Feedback
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
};

export default Landing;
