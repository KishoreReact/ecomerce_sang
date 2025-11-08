// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import store from './redux/store';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Wishlist from './pages/Wishlist/Wishlist';
import Orders from './pages/Orders/Orders'
import Cart from './pages/Cart/Cart';
import RegisterForm from './pages/Login/LoginForm/RegisterForm';
import Loader from './Components/Loader/Loader';
import TrackOrder from './pages/Orders/TrackOrder';
import ProductDetails from './pages/Product/ProductDetails';

const AppContent = ({ loading }) => {
    useEffect(() => {
    const disableVisualSearch = () => {
      document.querySelectorAll("img").forEach((img) => {
        img.setAttribute("data-noimgsearch", "true");
      });
    };
    disableVisualSearch();
    const observer = new MutationObserver(disableVisualSearch);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  
  return (
    <Router>
      <AuthGuard>
        <div>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route path="/account" element={<Orders/>} />
            <Route path="/trackorder" element={<TrackOrder/>} />
            <Route path="/shop" element={<Shop/>} />
            <Route path="/view" element={<ProductDetails/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
          {loading > 0 && <Loader />}
        </div>
      </AuthGuard>
    </Router>
  );
};

// AuthGuard component to handle authentication and back button prevention
const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');

      // Protected routes that require authentication
      const protectedRoutes = ['/home', '/shop', '/cart', '/wishlist', '/account', '/trackorder', '/view'];
      // Public routes that don't require authentication
      const publicRoutes = ['/', '/login', '/register'];

      // If user is not logged in (no userData or authToken) and trying to access protected routes
      if ((!userData || !authToken) && protectedRoutes.includes(location.pathname)) {
        navigate('/login', { replace: true });
        return;
      }

      // If user is logged in and trying to access login/register pages
      if (userData && authToken && publicRoutes.includes(location.pathname)) {
        navigate('/home', { replace: true });
        return;
      }
    };

    checkAuth();

    // Listen for browser back/forward button events
    const handlePopState = (event) => {
      const userData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');
      const protectedRoutes = ['/home', '/shop', '/cart', '/wishlist', '/account', '/trackorder', '/view'];
      const publicRoutes = ['/', '/login', '/register'];

      // If user is not authenticated and trying to navigate to protected routes via back/forward
      if ((!userData || !authToken) && protectedRoutes.includes(window.location.pathname)) {
        // Prevent the navigation and redirect to login
        event.preventDefault();
        window.history.replaceState(null, '', '/login');
        navigate('/login', { replace: true });
        return;
      }

      // If user is authenticated and trying to navigate to public routes via back/forward
      if (userData && authToken && publicRoutes.includes(window.location.pathname)) {
        // Prevent the navigation and redirect to home
        event.preventDefault();
        window.history.replaceState(null, '', '/home');
        navigate('/home', { replace: true });
        return;
      }
    };

    // Disable browser back/forward buttons on login page
    const disableBrowserNavigation = () => {
      if (location.pathname === '/login' || location.pathname === '/') {
        // Push multiple states to create a barrier for back navigation
        window.history.pushState(null, '', window.location.pathname);
        window.history.pushState(null, '', window.location.pathname);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Handle popstate events specifically for login page
    const handleLoginPageNavigation = (event) => {
      if (location.pathname === '/login' || location.pathname === '/') {
        // Prevent navigation and stay on login page
        event.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Initial setup
    disableBrowserNavigation();

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('popstate', handleLoginPageNavigation);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('popstate', handleLoginPageNavigation);
    };
  }, [location.pathname, navigate]);

  return children;
};

const mapStateToProps = (state) => ({
  loading: state.loading.loading,
});

const ConnectedAppContent = connect(mapStateToProps)(AppContent);

function App() {
  return (
    <Provider store={store}>
      <ConnectedAppContent />
    </Provider>
  );
}

export default App;
