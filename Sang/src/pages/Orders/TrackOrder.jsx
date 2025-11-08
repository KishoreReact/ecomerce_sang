import React from 'react';
import './TrackOrder.css';
import Header from "../../Components/Header/Header";
import ShopBanner from "../../Components/Banner/Banner";
import Footer from '../../Components/Footer/Footer';
import BottomNavigation from '../../Components/BottomMenu/BottomNavigation';

const TrackOrder = () => {
  return (
    <>
          <Header />
          <ShopBanner
                  header=""                                    // top-left blue title
                  badgeText="Track order"                                // small orange badge text
                  subheader=""                 // big subheader inside banner
                  backgroundImage="/banner.jpg"    // relative or absolute URL to background
                  height="94px"                                  // banner height (optional)
                />
   
    <div className="track-order-container">

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Status Steps */}
        <div className="status-steps">
          <div className="step-item active">
            <div className="step-icon-wrapper">
              <div className="step-icon placed">
                <svg viewBox="0 0 100 100" className="icon">
                  <rect x="20" y="50" width="60" height="35" fill="#FDB755" rx="3"/>
                  <circle cx="35" cy="90" r="6" fill="#E84C3D"/>
                  <circle cx="65" cy="90" r="6" fill="#E84C3D"/>
                  <path d="M 40 25 L 50 35 L 40 45" stroke="#E84C3D" strokeWidth="3" fill="none"/>
                  <circle cx="50" cy="25" r="8" fill="#E84C3D"/>
                  <line x1="50" y1="33" x2="50" y2="50" stroke="#E84C3D" strokeWidth="3"/>
                </svg>
              </div>
            </div>
            <div className="step-label">PLACED</div>
          </div>

          <div className="step-item active">
            <div className="step-icon-wrapper">
              <div className="step-icon approval">
                <svg viewBox="0 0 100 100" className="icon">
                  <rect x="25" y="25" width="50" height="50" fill="#FF6B4A" rx="3"/>
                  <path d="M 35 50 L 45 60 L 65 40" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="35" y1="70" x2="65" y2="70" stroke="#D45A3C" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="step-label">APPROVAL</div>
          </div>

          <div className="step-item">
            <div className="step-icon-wrapper">
              <div className="step-icon processing">
                <svg viewBox="0 0 100 100" className="icon">
                  <circle cx="50" cy="50" r="35" fill="#E88B7D" stroke="#D4756A" strokeWidth="6"/>
                  <rect x="42" y="35" width="16" height="12" fill="#C9665A" rx="2"/>
                  <rect x="35" y="47" width="30" height="3" fill="#C9665A"/>
                </svg>
              </div>
            </div>
            <div className="step-label">PROCESSING</div>
          </div>

          <div className="step-item">
            <div className="step-icon-wrapper">
              <div className="step-icon shipping">
                <svg viewBox="0 0 100 100" className="icon">
                  <rect x="15" y="40" width="45" height="25" fill="#B8B8B8" rx="2"/>
                  <rect x="60" y="35" width="25" height="30" fill="#9E9E9E" rx="2"/>
                  <circle cx="30" cy="70" r="6" fill="#666"/>
                  <circle cx="70" cy="70" r="6" fill="#666"/>
                  <line x1="65" y1="50" x2="75" y2="50" stroke="#7A7A7A" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="step-label">SHIPPING</div>
          </div>

          <div className="step-item">
            <div className="step-icon-wrapper">
              <div className="step-icon delivery">
                <svg viewBox="0 0 100 100" className="icon">
                  <path d="M 35 30 L 35 70 L 65 70 L 65 30 Z" fill="#B8B8B8"/>
                  <rect x="40" y="35" width="20" height="25" fill="#9E9E9E"/>
                  <path d="M 30 30 L 50 20 L 70 30" fill="#9E9E9E"/>
                  <circle cx="70" cy="45" r="12" fill="#D4D4D4" stroke="#9E9E9E" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div className="step-label">DELIVERY</div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-bar-label">APPROVAL</div>
        </div>

        {/* Order Details */}
        <div className="order-details2">
          <div className="detail-item">
            <span className="detail-label">Placed</span>
          </div>
          <div className="detail-item">
            <span className="detail-value">30 September, 2025 07:38</span>
          </div>
          <div className="detail-item">
            <span className="detail-message">Your Order Is Successfully Placed</span>
          </div>
        </div>
      </div>

      
    </div>
                  <BottomNavigation cartCount={6}/>

    <Footer />
     </>
  );
};

export default TrackOrder;