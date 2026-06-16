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
            <a href="/dashboard" className="footer__link">Dashboard</a>
            <a href="/my-feedback" className="footer__link">My Feedback</a>
            <a href="https://snpsu.edu.in/engineering/" target="_blank" rel="noreferrer" className="footer__link">University Website</a>
          </nav>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Follow Us</h4>
          <div className="footer__social">
            <a href="https://www.youtube.com/channel/UC7CQf-ButBsrY0L_5wNh43Q" target="_blank" rel="noreferrer" aria-label="YouTube">YouTube</a>
            <a href="https://www.instagram.com/sapthagirinpsuniversity?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
            <a href="https://www.facebook.com/sapthagiriuniversity/" target="_blank" rel="noreferrer" aria-label="Facebook">Facebook</a>
            <a href="https://www.linkedin.com/school/sapthagiri-nps-university/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://api.whatsapp.com/send/?phone=919035922194&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" aria-label="WhatsApp">WhatsApp</a>
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
