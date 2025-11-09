import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';
import './Orders.css';
import Header from "../../Components/Header/Header";
import ShopBanner from "../../Components/Banner/Banner";
import Footer from '../../Components/Footer/Footer';
import { getOrderList, getCartist, getWishist } from "../../redux/services/productService";
import BottomNavigation from '../../Components/BottomMenu/BottomNavigation';
import OrderComplete from '../Checkout/Ordercomplete';

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
      const [cartCount, setCartCount] = useState(0);
      const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [wishlist, setWishlist] = useState([]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await getOrderList(page);
      const parsedResult = JSON.parse(response.result);
      const data = parsedResult.Data || [];

      // ✅ Show only 10 orders at a time (replace instead of append)
      setOrders(data);

      // ✅ If less than 10 records, stop further pages
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageNumber);
  }, [pageNumber]);

  const handleNext = () => {
    if (hasMore && !loading) {
      setPageNumber(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (pageNumber > 1 && !loading) {
      setPageNumber(prev => prev - 1);
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
            setCartItems(mappedItems);
            setCartCount(mappedItems.length);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      };

      fetchCart();
    }, []);

    // fetch wishlist
    useEffect(() => {
      const fetchWishlist = async () => {
        try {
          const res = await getWishist();
          const parsedResult = JSON.parse(res.result);
          setWishlist(parsedResult.Data || []);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };

      fetchWishlist();
    }, []);

  const handleClick = () => {
    navigate('/trackorder');
  };

  // 🕒 Helper to format date/time nicely
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `${formattedDate}`;
  };

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state and localStorage
    dispatch(logout());

    // Force navigation to login and reload to clear any cached state
    window.location.href = '/login';
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  return (
    <>
      <Header />
      <ShopBanner
        header=""
        badgeText="Account"
        subheader=""
        backgroundImage="/banner.jpg"
        height="94px"
      />

      <div className="account-container">
        <div className="sidebar">
          <h1 className="account-title">MY ACCOUNT</h1>
          <nav className="nav-menu2">
            <button className="nav-item">Dashboard</button>
            <button className="nav-item active">Orders</button>
            <button className="nav-item">Downloads</button>
            <button className="nav-item">Addresses</button>
            <button className="nav-item">Account details</button>
            <button className="nav-item">Buy again</button>
            <button className="nav-item"onClick={() => navigate('/wishlist')}>Wishlist</button>
             <button className="nav-item logout-item" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>

        <div className="content">
          {selectedOrderId ? (
            <OrderComplete orderId={selectedOrderId} viewOrder={true} />
          ) : (
            <>
              <div className="orders-header">
                <div className="header-col order-col">ORDER</div>
                <div className="header-col date-col">DATE & TIME</div>
                <div className="header-col status-col">STATUS</div>
                <div className="header-col total-col">TOTAL</div>
                <div className="header-col actions-col"></div>
              </div>

              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <div key={index} className="order-row">
                    <div className="order-cell order-col" data-label="ORDER">
                      <span className="order-id">#{order.Docno}</span>
                    </div>
                    <div className="order-cell date-col" data-label="DATE & TIME">
                      <span className="order-date">{formatDateTime(order.Date)}</span>
                    </div>
                    <div className="order-cell status-col" data-label="STATUS">
                      <span className="order-status">{order.Status}</span>
                    </div>
                    <div className="order-cell total-col" data-label="TOTAL">
                      <span className="order-total">{order.Total}</span>
                      <span className="order-items">  {order.total}</span>
                    </div>
                    <div className="order-cell actions-col" data-label="ACTIONS">
                      <button className="btn-view" onClick={() => handleViewOrder(order.TransId)}>VIEW</button>
                      <button className="btn-track" onClick={handleClick}>TRACK ORDER</button>
                      <button className="btn-invoice">INVOICE</button>
                    </div>
                  </div>
                ))
              ) : (
                !loading && <p className="no-data-text">No orders found.</p>
              )}

              {loading && <p className="loading-text">Loading...</p>}

              <div className="pagination-controls">
                <button
                  className="prev-btn2"
                  onClick={handlePrevious}
                  disabled={pageNumber === 1 || loading}
                >
                  ← Previous
                </button>
                <span className="page-info">Page {pageNumber}</span>
                <button
                  className="next-btn2"
                  onClick={handleNext}
                  disabled={!hasMore || loading}
                >
                  Next →
                </button>
              </div>

              {!hasMore && !loading && orders.length < 10 && (
                <p className="no-more-text">No more orders to load.</p>
              )}
            </>
          )}
        </div>

        {/* <div className="chat-widget">
          <div className="chat-icon">💬</div>
          <div className="chat-text">Chat with us</div>
        </div> */}
      </div>
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
      

      <Footer />
    </>
  );
};

export default Orders;
