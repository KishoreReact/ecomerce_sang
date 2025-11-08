import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronDown } from 'lucide-react';
import { getWishist, getCartist } from '../../redux/services/productService';
import './SearchHeader.css';

const SearchHeader = ({ categories = [], selectedCategory = null, onCategoryChange, onSearch, initialQuery = "", cartTrigger = 0, wishlistTrigger = 0, onCartUpdate }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0.0);
    const [query, setQuery] = useState(initialQuery);
  
       const navigate = useNavigate();
  
    useEffect(() => {
      setQuery(initialQuery);
    }, [initialQuery]);


  const fetchCartData = useCallback(async () => {
    try {
      const res = await getCartist();
      const parsedData = JSON.parse(res.result);
      const cartItems = parsedData.Data || [];
      const totalQuantity = cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0);
      setCartCount(cartItems.length);
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.Rate || 0) * (item.Quantity || 1), 0) || 0;
      setCartAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishist();
        const parsedData = JSON.parse(res.result);
        setWishlistCount(parsedData.Data?.length || 0);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [wishlistTrigger]);

  useEffect(() => {
    fetchCartData();
  }, [cartTrigger]);

  // Expose fetchCartData to parent components
  useEffect(() => {
    if (onCartUpdate) {
      onCartUpdate(fetchCartData);
    }
  }, [onCartUpdate, fetchCartData]);

  const handleSearch = () => {
    if (!query && !selectedCategory) return;

    if (onSearch) {
      onSearch(query);
    } else {
      navigate("/shop", {
        state: {
          query,
          category: selectedCategory,
        },
      });
    }
  };

  return (
    <header className="search-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <img
            src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/53ebc155-d989-459b-ab30-fcc3eef97a00/public"
            alt="Company Logo"
            className="header-logo"
          />
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)} // ✅ update query state
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ search on Enter
            />
            <div className="category-dropdown">
              <select
                value={selectedCategory?.Id || "default"}
                onChange={(e) => {
                  const selected = categories.find(
                    (cat) => cat.Id === parseInt(e.target.value)
                  );
                  onCategoryChange(selected);
                }}
                className="category-select"
              >
                <option value="default" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.Id} value={cat.Id}>
                    {cat.Name}
                  </option>
                ))}
              </select>
            </div>

            <button className="search-button"  onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <button className="wishlist-btn" onClick={(e) => { e.preventDefault(); navigate('/wishlist'); }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="badge">{wishlistCount}</span>
          </button>

          <button className="cart-btn" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </button>

          <div className="cart-price">{cartAmount.toFixed(2)} AED</div>

          <button className="account-btn" onClick={(e) => { e.preventDefault(); navigate('/account'); }}>MY ACCOUNT</button>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
