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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

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
    a: 'Yes, all feedback submissions are anonymous to instructors. Only the administrator can see your identity for coverage tracking. Your name, USN, and email are never shared with faculty. Only the subject, rating, and your comments are recorded to ensure honest and unbiased responses.',
  },
  {
    q: 'How do I submit feedback?',
    a: 'After logging in with your student credentials, navigate to the Dashboard and click on "Submit Feedback" for the active subject. Fill in your ratings and comments, then submit. You can submit feedback for each subject once per allotted session.',
  },
  {
    q: 'Can I view my past feedback?',
    a: 'Yes, you can view all your previously submitted feedback from the "My Feedback" section. This allows you to track what you have shared across different subjects over time.',
  },
  {
    q: 'How do administrators use the data?',
    a: 'Administrators can access aggregated feedback reports through the dashboard. They can view submission rates, subject-wise feedback, and export reports in Excel or Word format for analysis and accreditation purposes.',
  },
  {
    q: 'What if I face login issues?',
    a: 'If you are unable to log in, ensure you are using the correct email, USN, and password provided by the college. These credentials are issued to you during admission, not during registration on this platform. If the problem persists, contact the department administrator or your class coordinator for assistance.',
  },
  {
    q: 'Is the platform accessible on mobile?',
    a: 'Yes, the Feedback Collector is fully responsive and works seamlessly on desktops, tablets, and mobile phones. You can submit feedback and check reports from any device with an internet connection.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-header__inner">
          <img src="/images/navbar-logo.webp" alt="SOAS - Sapthagiri NPS University" width="2905" height="712" className="landing-header__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }} />
          <div className="landing-header__right">
            <nav className="landing-header__nav" aria-label="Landing page navigation">
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
              <a href="https://snpsu.edu.in/engineering/" target="_blank" rel="noreferrer">University</a>
            </nav>
            <button className="landing-header__cta" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__overlay" />
        <div className="landing-hero__content">
          <span className="landing-hero__badge">Sapthagiri NPS University</span>
          <h1 className="landing-hero__title">Feedback Collector</h1>
          <p className="landing-hero__subtitle">
            A streamlined platform for students to share course feedback and for faculty to gain actionable insights, driving continuous improvement in education.
          </p>
          <div className="landing-hero__actions">
            <button className="landing-hero__btn landing-hero__btn--primary" onClick={() => navigate('/login')}>
              Get Started
            </button>
            <button className="landing-hero__btn landing-hero__btn--outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
          <button className="landing-hero__btn landing-hero__btn--ghost" onClick={() => navigate('/feedback/public')}>
            Give Feedback Anonymously
          </button>
        </div>
      </section>

      <section id="about" className="landing-section landing-about">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">About Sapthagiri NPS University</h2>
          <p>
            Sapthagiri NPS University is committed to providing high-quality technical education that combines strong foundational knowledge with practical skills, ethical values and leadership qualities. Our programme prepares graduates to excel in the rapidly evolving tech industry while contributing responsibly to society.
          </p>
          <p>
            Through state-of-the-art infrastructure, innovative teaching-learning methods and a balanced focus on theory and hands-on applications, we nurture globally competent engineers capable of addressing complex computing challenges and developing sustainable, socially responsible solutions.
          </p>
        </div>
      </section>

      <section className="landing-section landing-vmv">
        <div className="landing-section__inner">
          <div className="landing-vmv__grid">
            <div className="landing-vmv__card">
              <div className="landing-vmv__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3>Our Vision</h3>
              <p>To empower students with deep technical knowledge, ethical values and leadership skills, enabling them to become responsible contributors to society and the tech industry.</p>
            </div>
            <div className="landing-vmv__card">
              <div className="landing-vmv__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Our Mission</h3>
              <ul>
                <li>Value-based technical education with state-of-the-art infrastructure</li>
                <li>Nurture ethical, motivated and skilled engineers</li>
                <li>Develop ability to solve problems individually and collaboratively</li>
                <li>Nurture globally competent engineers for sustainable solutions</li>
              </ul>
            </div>
            <div className="landing-vmv__card landing-vmv__card--wide">
              <div className="landing-vmv__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Core Values</h3>
              <div className="landing-vmv__tags">
                <span>Technical Excellence</span>
                <span>Ethics &amp; Integrity</span>
                <span>Innovation &amp; Creativity</span>
                <span>Collaboration &amp; Teamwork</span>
                <span>Lifelong Learning</span>
                <span>Social Responsibility</span>
                <span>Leadership</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-features">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">How It Works</h2>
          <div className="landing-features__grid">
            <div className="landing-feature-card">
              <div className="landing-feature-card__num">01</div>
              <h3>Submit Feedback</h3>
              <p>Students can anonymously submit feedback on courses and instructors after each class session.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-card__num">02</div>
              <h3>Track Progress</h3>
              <p>Students can view their feedback history across all subjects and stay updated on submission deadlines.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-card__num">03</div>
              <h3>Admin Dashboard</h3>
              <p>Only admin can view aggregated feedback, track submission rates, and export reports.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-card__num">04</div>
              <h3>Anonymous Feedback</h3>
              <p>Anyone can submit anonymous feedback without logging in. Select a subject, optionally name the faculty, and share your thoughts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-stats">
        <div className="landing-stats__bg" />
        <div className="landing-section__inner">
          <div className="landing-stats__grid">
            <div className="landing-stat">
              <span className="landing-stat__num">3+</span>
              <span className="landing-stat__label">Academic Sections</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat__num">6+</span>
              <span className="landing-stat__label">Subjects per Sem</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat__num">100%</span>
              <span className="landing-stat__label">Digital Workflow</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat__num">24/7</span>
              <span className="landing-stat__label">Platform Access</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section landing-faq">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">Frequently Asked Questions</h2>
          <div className="landing-faq__list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`landing-faq__item ${openFaq === i ? 'landing-faq__item--open' : ''}`}>
                <button
                  className="landing-faq__question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span>{item.q}</span>
                  <svg className="landing-faq__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" className="landing-faq__icon-v" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="landing-faq__answer"
                  role="region"
                  hidden={openFaq !== i}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <div className="landing-section__inner">
          <h2>Ready to share your feedback?</h2>
          <p>Sign in with your student credentials or submit anonymous feedback without logging in.</p>
          <div className="landing-cta__actions">
            <button className="landing-hero__btn landing-hero__btn--primary" onClick={() => navigate('/login')}>
              Sign In Now
            </button>
            <button className="landing-hero__btn landing-hero__btn--outline" onClick={() => navigate('/feedback/public')}>
              Give Anonymous Feedback
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
