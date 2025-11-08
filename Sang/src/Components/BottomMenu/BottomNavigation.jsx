import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShoppingCart
} from "react-icons/ai";
import "../../pages/Wishlist/Wishlist.css";
import SlideCart from "../../pages/Cart/Slidecart";

// Add CSS for slide cart overlay
const slideCartStyles = `
  .slide-cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-top: 20px;
    padding-right: 20px;
  }

  .slide-cart-container {
    position: relative;
  }

  .bottom-navigation {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    border-top: 1px solid #ddd;
    padding: 8px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #777;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    padding: 5px;
    min-width: 60px;
    transition: transform 0.2s ease;
  }

  .nav-item:hover {
    transform: translateY(-2px);
  }

  .nav-item.active {
    color: #e74c3c;
    font-weight: 600;
  }

  .cart-badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background: #e74c3c;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 600;
    min-width: 18px;
    text-align: center;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .bottom-navigation {
      padding: 6px 0;
    }

    .nav-item {
      min-width: 50px;
      padding: 3px;
      font-size: 11px;
    }

    .cart-badge {
      top: -3px;
      right: -8px;
      padding: 1px 5px;
      font-size: 9px;
      min-width: 16px;
    }
  }
`;

const BottomNavigation = ({ cartCount, wishlistCount, cartItems = [], onCartUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSlideCart, setShowSlideCart] = useState(false);

  const isHomeOrShop =
    location.pathname === "/home" ||
    location.pathname === "/shop" ||
    location.pathname === "/";

  // Define navigation items
  const navItems = [
    { icon: <AiOutlineHome size={24} />, label: "Home", path: "/home" },
    { icon: <AiOutlineShopping size={24} />, label: "Shop", path: "/shop" },
    { icon: <AiOutlineUser size={24} />, label: "My account", path: "/account" },
    {
      icon: <AiOutlineShoppingCart size={24} />,
      label: "Cart",
      isCart: true
    },
    {
      icon: <AiOutlineHeart size={24} />,
      label: "Wishlist",
      path: "/wishlist",
      isWishlist: true
    }
  ];

  return (
    <>
      {/* Inject styles */}
      <style dangerouslySetInnerHTML={{ __html: slideCartStyles }} />

      {/* Slide Cart Overlay */}
      {showSlideCart && isHomeOrShop && (
        <div
          className="slide-cart-overlay"
          onClick={() => setShowSlideCart(false)}
        >
          <div
            className="slide-cart-container"
            onClick={(e) => e.stopPropagation()}
          >
            <SlideCart
              cartItems={cartItems}
              onClose={() => setShowSlideCart(false)}
              onViewCart={() => {
                setShowSlideCart(false);
                navigate("/cart");
              }}
              onCheckout={() => {
                setShowSlideCart(false);
                navigate("/cart", {
                  state: { step: "checkout", cartItems }
                });
              }}
              onCartUpdate={onCartUpdate}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        {navItems.map((item, index) => {
          const isActive =
            item.path && location.pathname.startsWith(item.path);

          return (
            <div
              key={index}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                if (item.isCart) {
                  if (isHomeOrShop) {
                    setShowSlideCart(true);
                  } else {
                    navigate("/cart");
                  }
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <div className="nav-icon">{item.icon}</div>
              <span>{item.label}</span>
              {item.isCart && cartCount > 0 && (
                <div className="cart-badge">{cartCount}</div>
              )}
              {item.isWishlist && wishlistCount > 0 && (
                <div className="cart-badge">{wishlistCount}</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BottomNavigation;
