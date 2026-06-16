const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/images/footer-logo.webp" alt="SOAS" className="footer__logo" />
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
          <a href="/dashboard" className="footer__link">Dashboard</a>
          <a href="/my-feedback" className="footer__link">My Feedback</a>
          <a href="https://snpsu.edu.in/engineering/" target="_blank" rel="noreferrer" className="footer__link">University Website</a>
        </div>

        <div className="footer__section">
          <h4 className="footer__heading">Follow Us</h4>
          <div className="footer__social">
            <a href="https://www.youtube.com/channel/UC7CQf-ButBsrY0L_5wNh43Q" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.instagram.com/sapthagirinpsuniversity?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/sapthagiriuniversity/" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.linkedin.com/school/sapthagiri-nps-university/posts/?feedView=all" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://api.whatsapp.com/send/?phone=919035922194&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer">WhatsApp</a>
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
