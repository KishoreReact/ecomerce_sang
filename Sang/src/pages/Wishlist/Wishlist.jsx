import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import Header from "../../Components/Header/Header";
import { useNavigate } from 'react-router-dom';
import { getWishist, deleteWishlist , getCartist} from "../../redux/services/productService"; // adjust path if needed
import ShopBanner from "../../Components/Banner/Banner";
import BottomNavigation from "../../Components/BottomMenu/BottomNavigation";

const Wishlist = () => {
   const [wishlist, setWishlist] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refresh, setRefresh] = useState(false);
   const [cartCount, setCartCount] = useState(0);
   const [cartItems, setCartItems] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishist();
        if (res.status === 'Success') {
          const parsedResult = JSON.parse(res.result);
          setWishlist(parsedResult.Data || []);
        } else if (res.message === 'WishList Records not Found') {
          setWishlist([]);
        } else {
          console.error("Error fetching wishlist:", res.message);
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [refresh]); // triggers refetch whenever 'refresh' changes

  const handleDeleteWishlist = async (transId) => {
    try {
      await deleteWishlist(transId);
      // Toggle refresh to trigger useEffect
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };
useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartist();
        const parsedResult = JSON.parse(res.result);
        if (parsedResult?.Data) {
          const mappedItems = parsedResult.Data.map((item, index) => ({
            id: item.TransId || index,
            transId: item.TransId,
            productId: item.Product, // important for matching
            name: item.Product_Name || "Unnamed Product",
            price: item.Rate || 0,
            quantity: item.Quantity || 1,
            image: "/api/placeholder/60/60",
          }));
          const totalQuantity = mappedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartItems(mappedItems);
          setCartCount(mappedItems.length);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);


  return (
    <>
      <Header />
      <ShopBanner
              header=""                                    // top-left blue title
              badgeText="Wishlist"                                // small orange badge text
              subheader=""                 // big subheader inside banner
              backgroundImage="/banner.jpg"    // relative or absolute URL to background
              height="94px"                                  // banner height (optional)
            />
      <div className="wishlist-container">
        {/* Header */}


        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/home')}>HOME</span>
          <span className="separator">/</span>
          <span>WISHLIST</span>
        </div>

        <div className="wishlist-content">
          {/* Left Sidebar */}
          <div className="sidebar">
            <h2 className="sidebar-title">MY ACCOUNT</h2>
            <ul className="sidebar-menu">
              <li className="menu-item">Dashboard</li>
              <li className="menu-item" onClick={() => navigate('/account')}>Orders</li>
              <li className="menu-item">Downloads</li>
              <li className="menu-item">Addresses</li>
              <li className="menu-item">Account details</li>
              <li className="menu-item">Buy again</li>
              <li className="menu-item active">Wishlist</li>
              <li className="menu-item">Logout</li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="wishlist-header-section">
              <h3 className="section-title">YOUR PRODUCTS WISHLIST</h3>
              <div className="share-section">
                {/* <span className="share-text">Share:</span>
                <div className="social-icons">
                  <i className="social-icon facebook"></i>
                  <i className="social-icon twitter"></i>
                  <i className="social-icon email"></i>
                  <i className="social-icon pinterest"></i>
                  <i className="social-icon linkedin"></i>
                  <i className="social-icon print"></i>
                </div> */}
              </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
      {loading ? (
        <p>Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p>No products in your wishlist.</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.TransId} className="product-card" onClick={() => navigate('/view', { state: { product: item } })}>
            <button
              className="remove-btn2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWishlist(item.TransId);
              }}
            >
              ✕
            </button>
   
            <div className="product-image-container">
              <img
                src={item.Image || "/api/placeholder/150/200"}
                alt={item.Product_Name}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h4 className="product-name3">{item.Product_Name}</h4>
              <p className="product-category">{item.Remarks || "N/A"}</p>
              <p className="product-price">AED {item.Rate}</p>
            </div>
          </div>
        ))
      )}
    </div>

          </div>
        </div>

        {/* Bottom Navigation */}
        {/* <div className="bottom-navigation">
          <div className="nav-item">
            <i className="nav-icon home"></i>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <i className="nav-icon shop"></i>
            <span>Shop</span>
          </div>
          <div className="nav-item">
            <i className="nav-icon account"></i>
            <span>My account</span>
          </div>
          <div className="nav-item"  onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>
            <i className="nav-icon cart"></i>
            <span>Cart</span>
            <div className="cart-badge">1</div>
          </div>
          <div className="nav-item active">
            <i className="nav-icon wishlist"></i>
            <span>Wishlist</span>
          </div>
        </div> */}
        <BottomNavigation
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          cartItems={cartItems}
          onCartUpdate={() => {
            // Refetch cart data when updated from slide cart
            const fetchCart = async () => {
              try {
                const res = await getCartist();
                const parsedResult = JSON.parse(res.result);
                if (parsedResult?.Data) {
                  const mappedItems = parsedResult.Data.map((item, index) => ({
                    id: item.TransId || index,
                    transId: item.TransId,
                    productId: item.Product,
                    name: item.Product_Name || "Unnamed Product",
                    price: item.Rate || 0,
                    quantity: item.Quantity || 1,
                    image: "/api/placeholder/60/60",
                  }));
                  setCartItems(mappedItems);
                  setCartCount(mappedItems.length);
                }
              } catch (error) {
                console.error("Error fetching cart:", error);
              }
            };
            fetchCart();
          }}
        />

        {/* Chat Button */}
        {/* <div className="chat-button">
          <span className="chat-text">Chat with us</span>
        </div> */}
      </div>
    </>
  );
};

export default Wishlist;
