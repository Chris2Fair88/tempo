import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getRole, getUserData } from '../lib/auth';
import { useState, useEffect, useRef } from 'react';

/**
 * Header Component - Phase 3 Performance Optimized
 * Memoized to prevent unnecessary re-renders when parent state changes
 */
const Header = memo(function Header() {
  const role = getRole();
  const userData = getUserData();
  const navigate = useNavigate();
  const [showContactInfo, setShowContactInfo] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowContactInfo(false);
      }
    }

    if (showContactInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactInfo]);

  function onLogout() {
    clearAuth();
    navigate('/');
  }

  const customerServiceInfo = {
    phone: '(555) 123-TEMPO',
    email: 'support@tempo-music.com',
    hours: 'Mon-Sun 8AM-8PM EST'
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-header__brand site-header__brand--centered">
          <span className="site-header__logo" aria-hidden="true">♫</span>
          <span className="site-header__name">Tempo</span>
          <span className="site-header__tag">— Keeping things on time!</span>
        </div>

        <div className="site-header__actions">
          {!role && (
            <div className="customer-service" ref={dropdownRef}>
              <button 
                className="customer-service__button"
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                Customer Service
              </button>
              {showContactInfo && (
                <div className="customer-service__dropdown">
                  <div className="customer-service__header">
                    <strong>Contact Information</strong>
                    <button 
                      className="customer-service__close"
                      onClick={() => setShowContactInfo(false)}
                      aria-label="Close contact information"
                    >
                      ×
                    </button>
                  </div>
                  <div className="customer-service__item">
                    <strong>📞 Phone:</strong> {customerServiceInfo.phone}
                  </div>
                  <div className="customer-service__item">
                    <strong>✉️ Email:</strong> {customerServiceInfo.email}
                  </div>
                  <div className="customer-service__item">
                    <strong>🕒 Hours:</strong> {customerServiceInfo.hours}
                  </div>
                </div>
              )}
            </div>
          )}
          {role && (
            <div className="site-header__user">
              {userData && (
                <span className="site-header__username">
                  {userData.name}
                </span>
              )}
              <button className="button-logout" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;