import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Otp = ({ onLogin }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState('');
  const [userData, setUserData] = useState(null);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMobile = localStorage.getItem('loginMobile');
    const savedUserData = localStorage.getItem('userData');
    
    if (!savedMobile || !savedUserData) {
      navigate('/login');
      return;
    }
    
    setMobile(savedMobile);
    setUserData(JSON.parse(savedUserData));
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        mobile,
        otp: otpValue
      });
      
      if (response.data.success) {
        onLogin(userData, mobile);
        localStorage.removeItem('loginMobile');
        localStorage.removeItem('userData');
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    setCanResend(false);
    setCountdown(45);
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        id: userData.nicNumber,
        mobile
      });
      
      if (response.data.success) {
        alert('New OTP sent to your mobile number');
        
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(response.data.message);
        setCanResend(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const formatMobile = (mobile) => {
    if (mobile.startsWith('0')) {
      return '+94 ' + mobile.substring(1, 4) + ' *** ***' + mobile.substring(9);
    }
    return mobile;
  };

  return (
    <div className="container zoomed" id="loginPage">
      <div className="login-container">
        <div className="login-header">
          <img src="/goverment.png" alt="Government Seal" className="gov-seal" />
          <h2>Police Clearance Certificate System</h2>
          <p>OTP Verification</p>
        </div>
        
        <div className="otp-container">
          <h3 className="otp-title">Verify Your Identity</h3>
          <p className="otp-subtitle">Enter the 6-digit code sent to your mobile</p>
          
          <div className="otp-mobile">
            Verification code sent to: <br />
            {formatMobile(mobile)} (ending in {mobile.slice(-4)})
          </div>
          
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-input"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
              />
            ))}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            className="button btn-primary" 
            style={{fontSize: '16px', padding: '12px 40px', width: '100%'}} 
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
          
          <span 
            className="otp-resend" 
            onClick={canResend ? handleResend : undefined}
            style={canResend ? {color: '#3498db', cursor: 'pointer'} : {color: 'gray', cursor: 'default'}}
          >
            Didn't receive the code? <strong>Resend Code</strong> (<span id="countdown">{countdown}</span> seconds)
          </span>
          
          <a href="#" className="otp-back" onClick={() => navigate('/login')}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Otp;