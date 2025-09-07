import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    id: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateLogin = () => {
    const { id, mobile } = formData;
    let valid = true;
    let errorMessage = '';
    
    // NIC validation (9 digits + V/X or 12 digits)
    const nicRegex = /^(?:\d{9}[VvXx]|\d{12})$/;
    if (!nicRegex.test(id)) {
      errorMessage = 'Please enter a valid NIC (12 digits or old format with V/X)';
      valid = false;
    }
    
    // Mobile validation (Sri Lankan number)
    const mobileRegex = /^(0|94|\+94)7\d{8}$/;
    if (!mobileRegex.test(mobile)) {
      errorMessage = 'Please enter a valid Sri Lankan mobile number (10 digits starting with 07)';
      valid = false;
    }
    
    if (errorMessage) {
      setError(errorMessage);
    }
    
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    setLoading(true);
    setError('');

    try {
      console.log('Sending login request:', formData);
      
      const response = await axios.post('http://localhost:5000/api/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('loginMobile', formData.mobile);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        navigate('/otp');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container zoomed" id="loginPage">
      <div className="login-container">
        <div className="login-header">
          <img src="/goverment.png" alt="Government Seal" className="gov-seal" />
          <h2>Police Clearance Certificate System</h2>
          <p>Applicant Login</p>
        </div>
        
        <div id="loginForm">
          <div className="form-group">
            <label className="form-label">NIC Number *</label>
            <input 
              type="text" 
              className="form-input" 
              id="loginNIC" 
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="200012345678 or 123456789V" 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input 
              type="tel" 
              className="form-input" 
              id="loginMobile" 
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="0771234567" 
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button 
              className="button btn-primary" 
              style={{fontSize: '16px', padding: '12px 40px'}} 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login with OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;