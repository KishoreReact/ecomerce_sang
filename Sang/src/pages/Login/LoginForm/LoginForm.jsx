import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/actions/authActions';
import { getCountryList } from '../../../redux/services/productService';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginForm.css';


const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
    const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);


  useEffect(() => {
    const fetchCountries = async () => {
      const countryList = await getCountryList();
      console.log("countryList", countryList);

      setCountries(countryList);
      if (countryList.length > 0) {
        setSelectedCountry(countryList[0]);
      }
    };
    fetchCountries();
  }, []);

  // Disable browser back button on login page
  useEffect(() => {
    const disableBackButton = () => {
      // Push multiple states to create a barrier
      window.history.pushState(null, '', location.pathname);
      window.history.pushState(null, '', location.pathname);
      window.history.pushState(null, '', location.pathname);
      window.history.pushState(null, '', location.pathname);
      window.history.pushState(null, '', location.pathname);
    };

    const handlePopState = (event) => {
      // Prevent navigation and stay on login page
      event.preventDefault();
      disableBackButton();
    };

    // Initial setup
    disableBackButton();

    // Add event listener
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      // Store user data in localStorage for persistence
      if (user.userData) {
        localStorage.setItem('userData', JSON.stringify(user.userData));
        localStorage.setItem('authToken', user.token || 'authenticated');
      }
      // Navigate to home and replace history to prevent back navigation to login
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password, entityId: selectedCountry?.Id || 1 }));
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left section with logo */}
        <div className="login-left">
          <img
            src="https://imagedelivery.net/k7eaND1MUD2q-kchTq5b6A/53ebc155-d989-459b-ab30-fcc3eef97a00/public"
            alt="Company Logo"
            className="login-logo"
          />
        </div>

        {/* Right section with form */}
        <div className="login-right">
          <div className="login-content">
            <h2 className="login-title">{selectedCountry?.name} User Login</h2>

            <form onSubmit={handleSubmit}>
              {/* Country Dropdown */}
              <div className="form-group">
                <div className="country-dropdown">
                  <div className="selected" onClick={() => setOpen(!open)}>
                    <span>{selectedCountry ? selectedCountry.name : 'Select Country'}</span>
                    <img src={selectedCountry?.flag} alt="" className="flag-icon" />
                    <span className="arrow">▼</span>
                  </div>
                  {open && (
                    <ul className="dropdown-list">
                      {countries.map((country, index) => (
                        <li
                          key={`${country.code}-${index}`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setOpen(false);
                          }}
                        >
                          <span>{country.name}</span> {/* lowercase 'name' */}
                          <img src={country.flag} alt="" className="flag-icon" />
                        </li>
                      ))}

                    </ul>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">✉</span>
                  <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
      <div className="input-container">
        <span className="input-icon">🔒</span>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="form-input"
          required
        />
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? "👁" : "👁"}
        </span>
      </div>
    </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="loader"></span> : 'LOGIN'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>

            <button
              type="button"
              className="register-btn"
              onClick={handleRegister}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
