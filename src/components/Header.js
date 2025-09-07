import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, mobile, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <div className="header">
      <div>
        <strong>🇱🇰 Sri Lanka Police - Police Clearance Certification (PCC)</strong>
      </div>
      <div>
        <span id="welcomeMessage">Welcome, {user.nameWithInitials}</span>
        <button className="button btn-danger logout-btn" style={{marginLeft: '10px'}} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;