import '../styles/Footer.css';
import { Link } from 'react-router-dom';
import { CirclePlay, Image, Globe, Briefcase, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/images/footer-logo.webp" alt="SOAS - Sapthagiri NPS University" width="1777" height="435" loading="lazy" className="footer__logo" />
          <p className="footer__desc">
            Sapthagiri NPS University offers quality education and holistic development for students across disciplines.
          </p>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Contact</h4>
          <p>#14/5, Chikkasandra, Hesaraghatta Main Road<br />Bengaluru - 560057</p>
          <p>Phone: 9353204949</p>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Quick Links</h4>
          <nav aria-label="Quick links">
            <Link to="/dashboard" className="footer__link">Dashboard</Link>
            <Link to="/my-feedback" className="footer__link">My Feedback</Link>
            <a href="https://snpsu.edu.in/" target="_blank" rel="noreferrer" className="footer__link">University Website</a>
          </nav>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Follow Us</h4>
          <div className="footer__social">
            <a href="https://www.youtube.com/channel/UC7CQf-ButBsrY0L_5wNh43Q" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer__social-link">
              <CirclePlay size={18} />
            </a>
            <a href="https://www.instagram.com/sapthagirinpsuniversity/" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer__social-link">
              <Image size={18} />
            </a>
            <a href="https://www.facebook.com/sapthagiriuniversity/" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer__social-link">
              <Globe size={18} />
            </a>
            <a href="https://www.linkedin.com/school/sapthagiri-nps-university/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer__social-link">
              <Briefcase size={18} />
            </a>
            <a href="https://api.whatsapp.com/send/?phone=919035922194&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="footer__social-link">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>&copy; 2026 Sapthagiri NPS University. All rights reserved.</span>
        <span className="footer__credit">Developed by Pawan Simha R &middot; MCA, SOAS</span>
      </div>
    </footer>
  );
};

export default Footer;
