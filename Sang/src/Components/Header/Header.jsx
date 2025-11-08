// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem('userData');
  
    if (data) {
      let parsedData = JSON.parse(data);
  console.log("parsedData22",parsedData);
  
      // Check if parsedData is still a string (double stringified case)
      if (typeof parsedData === 'string') {
        parsedData = JSON.parse(parsedData);
      }
  
      if (parsedData && parsedData[0]) {
        setUserData(parsedData[0])
      }
    }
        const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
console.log("userData22",userData);

  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem('userData'));
  //   if (data && data.length > 0) setUserData(data[0]);

  //   const handleClickOutside = (e) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  //       setOpenDropdown(false);
  //     }
  //   };
  //   document.addEventListener('click', handleClickOutside);
  //   return () => document.removeEventListener('click', handleClickOutside);
  // }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clear user state
    setUserData(null);
    setOpenDropdown(false);

    // Force navigation to login and reload to clear any cached state
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/home'); setIsMenuOpen(false); }}>
            🏠 HOME
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/shop'); setIsMenuOpen(false); }}>
            🛒 SHOP
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); setIsMenuOpen(false); }}>
            ✨ WISHLIST
          </a>
          <a href="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">🎫</span> RAISE A TICKET
          </a>
          <a href="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">✨</span> CLEARANCES
          </a>
          <a href="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>CONTACT US</a>
          <a href="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>CERTIFICATE VAULT MANAGER</a>
        </nav>

        <div className="header-contact">
          <span className="phone-number">+971 4 2668871</span>
          <span className="support-text">24/7 support center</span>

          {userData && (
            <div className="user-dropdown" ref={dropdownRef}>
              <img
                      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      alt="avatar"
                      className="avatar"
                    />
              <button className="user-btn" onClick={() => setOpenDropdown(!openDropdown)}>
                {userData.LoginName} 
              </button>

              {openDropdown && (
                <div className="dropdown-content">
                  <div className="profile-section">
                    <img
                      src="https://via.placeholder.com/50"
                      alt="avatar"
                      className="avatar"
                    />
                    <div className="profile-info">
                      <span className="profile-name">{userData.LoginName}</span>
                      <span className="profile-role">User</span>
                    </div>
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
