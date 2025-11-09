import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Brand Logos Section */}
      

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Left Section - Logo and Contact */}
        <div className="footer-left">
          <div className="gsg-logo">
            <img
            src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/53ebc155-d989-459b-ab30-fcc3eef97a00/public"
            alt="Company Logo"
            className="footer-logo"
          />
            <div className="logo-text">
              <span className="subtitle">GERMAN STANDARD GROUP</span>
            </div>
          </div>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon">📱</span>
              <span>WhatsApp: +971 4 2668871</span>
            </div>
            <div className="contact-item">
              <span className="icon">✉️</span>
              <span>Email: info@gsggroup.co</span>
            </div>
            <div className="contact-item">
              <span className="icon">📍</span>
              <span>Dubai, United Arab Emirates</span>
            </div>
          </div>

          <div className="social-icons">
            <a href="facebook" className="social-icon facebook">f</a>
            <a href="twitter" className="social-icon twitter">🐦</a>
            <a href="email" className="social-icon email">✉</a>
            <a href="pinterest" className="social-icon pinterest">P</a>
            <a href="linkedin" className="social-icon linkedin">in</a>
            <a href="telegram" className="social-icon telegram">✈</a>
          </div>
        </div>

        {/* Middle Section - Categories */}
        <div className="footer-middle">
          <h3>MOST POPULAR CATEGORIES</h3>
          <ul>
            <li><a href="Dogs">Brand by Dogs</a></li>
            <li><a href="Cats">Brand by Cats</a></li>
            <li><a href="Cattle" className="highlight">Brand by Cattle</a></li>
            <li><a href="Goat">Brand by Goat</a></li>
            <li><a href="Camel">Brand by Camel</a></li>
            <li><a href="Horse">Brand by Horse</a></li>
          </ul>
        </div>

        {/* Customer Services */}
        <div className="footer-services">
          <h3>CUSTOMER SERVICES</h3>
          <ul>
            <li><a href="Conditions">Terms & Conditions</a></li>
            <li><a href="FAQ">FAQ</a></li>
            <li><a href="Policy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Right Section - Download App */}
        <div className="footer-right">
          <h3>Download App</h3>
          <div className="app-buttons">
            <a href="appbutton" className="app-button">
              <div className="apple-icon">🍎</div>
              <div className="app-text">
                <span className="small">Download on the</span>
                <span className="large">App Store</span>
              </div>
            </a>
            <a href="appbutton" className="app-button">
              <div className="play-icon">▶</div>
              <div className="app-text">
                <span className="small">GET IT ON</span>
                <span className="large">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Payment */}
      <div className="footer-bottom">
        <div className="copyright">
          All Rights Reserved © <strong>2024</strong> GERMAN STANDARD GROUP .
        </div>
        <div className="payment-methods2">
          <div className="payment-card visa">VISA</div>
          <div className="payment-card mastercard">●●</div>
          <div className="payment-card maestro">⟨⟩</div>
          <div className="payment-card amex">AMEX</div>
        </div>
      </div>


    </footer>
  );
};

export default Footer;