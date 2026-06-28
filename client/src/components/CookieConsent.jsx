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
import '../styles/CookieConsent.css';
import { useState } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookie_consent'));

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent" aria-modal="true">
      <p className="cookie-consent__text">
        This site uses essential cookies for security and functionality. No tracking or analytics cookies are used. See our{' '}
        <a href="/PRIVACY.md" target="_blank" rel="noopener noreferrer" className="cookie-consent__link">Privacy Policy</a>.
      </p>
      <div className="cookie-consent__actions">
        <button className="cookie-consent__btn cookie-consent__btn--accept" onClick={accept}>
          Accept
        </button>
        <button className="cookie-consent__btn cookie-consent__btn--decline" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;