import React from "react";
import PropTypes from "prop-types";
import "./ShopBanner.css";

const ShopBanner = ({ 
  header = "",
  badgeText = "Shop",
  subheader = "",
  backgroundImage = "/banner.jpg", // corrected path
  height = "110px",
  className = ""
}) => {
  // If no backgroundImage provided, the CSS fallback color/pattern will show.
  const style = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    "--banner-height": height
  };

  return (
    <div className={`shop-hero ${className}`}>
      <h3 className="shop-heading">{header}</h3>

      <div className="shop-banner" style={style}>
        <div className="shop-banner-content">
          <div className="shop-badge" aria-hidden>
            <span className="shop-badge-text">{badgeText}</span>
          </div>

          <div className="shop-subwrap">
            <div className="shop-subheader">{subheader}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ShopBanner.propTypes = {
  header: PropTypes.string,
  badgeText: PropTypes.string,
  subheader: PropTypes.string,
  backgroundImage: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
};

export default ShopBanner;
