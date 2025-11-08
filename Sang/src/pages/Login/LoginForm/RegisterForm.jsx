import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    country: 'UAE',
    accountType: '',
    email: '',
    username: 'Test',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    name: 'testuser'
  });
  const [errors, setErrors] = useState({});

  const tabs = ['General details', 'User Details', 'Upload Docs'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (activeTab === 1) {
      if (!formData.email) {
        newErrors.email = 'This field is required.';
      }
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = 'This field is required.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 0) {
      console.log('Form submitted:', formData);
    }
  };

  const renderGeneralDetails = () => (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="country">Country *</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        >
          <option value="UAE">UAE</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="accountType">Account Type *</label>
        <select
          id="accountType"
          name="accountType"
          value={formData.accountType}
          onChange={handleInputChange}
        >
          <option value="">Account Type*</option>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </div>
      
      <div className="button-group">
        <button type="button" className="btn-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );

  const renderUserDetails = () => (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="username">Username *</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number *</label>
        <input
          type="tel"
          id="mobileNumber"
          name="mobileNumber"
          placeholder="Mobile Number*"
          value={formData.mobileNumber}
          onChange={handleInputChange}
          className={errors.mobileNumber ? 'error' : ''}
        />
        {errors.mobileNumber && <div className="error-message">{errors.mobileNumber}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <div className="password-row">
          <div className="password-field">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="password-strength">Medium</div>
            <div className="password-label">Password</div>
          </div>
          <div className="password-field">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <div className="password-label">Confirm Password</div>
          </div>
        </div>
      </div>
      
      <div className="button-group">
        <button type="button" className="btn-previous" onClick={handlePrevious}>
          Previous
        </button>
        <button type="button" className="btn-next" onClick={handleNext}>
          Next
        </button>
        <button type="button" className="btn-back-to-login">
          Back to login
        </button>
      </div>
    </div>
  );

  const renderUploadDocs = () => (
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="First Name*"
          value={formData.name}
          onChange={handleInputChange}
        />
        <div className="file-upload-area">
          <span>testuser</span>
        </div>
      </div>
      
      <div className="button-group">
        <button type="button" className="btn-next" onClick={handlePrevious}>
          Next
        </button>
        <button type="button" className="btn-back-to-login">
          Back to login
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return renderGeneralDetails();
      case 1:
        return renderUserDetails();
      case 2:
        return renderUploadDocs();
      default:
        return renderGeneralDetails();
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>User Registration</h2>
        <div className="breadcrumb">
          <span>HOME</span> / <span>USER REGISTRATION</span>
        </div>
      </div>
      
      <div className="register-form">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="form-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;