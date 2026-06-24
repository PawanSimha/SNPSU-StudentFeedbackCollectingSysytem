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
import '../styles/NotFound.css';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="not-found">
      <div className="not-found__spotlight" aria-hidden="true" />

      <div className="not-found__brand">
        <img
          src="/images/navbar-logo.webp"
          alt="SOAS Feedback Collector"
          width="160"
          height="39"
          className="not-found__logo"
        />
      </div>

      <div className="not-found__illustration" aria-hidden="true">
        <div className="not-found__compass">
          <div className="not-found__compass-ring" />
          <div className="not-found__compass-face">
            <span className="not-found__compass-dir not-found__compass-dir--n">N</span>
            <span className="not-found__compass-dir not-found__compass-dir--s">S</span>
            <span className="not-found__compass-dir not-found__compass-dir--e">E</span>
            <span className="not-found__compass-dir not-found__compass-dir--w">W</span>
            <div className="not-found__compass-needle" />
            <div className="not-found__compass-pivot" />
          </div>
        </div>
      </div>

      <p className="not-found__code" aria-hidden="true">404</p>

      <h1 className="not-found__title">Page Not Found</h1>

      <p className="not-found__desc">
        The page you&rsquo;re looking for may have been moved, renamed, or no longer exists.
      </p>

      <div className="not-found__actions" role="group" aria-label="Recovery actions">
        <button
          className="not-found__btn not-found__btn--primary"
          onClick={() => navigate('/')}
        >
          Go to Homepage
        </button>
        <button
          className="not-found__btn not-found__btn--secondary"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;