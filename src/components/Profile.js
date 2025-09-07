import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const Profile = ({ user, mobile }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, [mobile]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${mobile}`);
      
      if (response.data.success) {
        setProfileData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header user={user} />
        <div className="main-content">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header user={user} />
      
      <div className="language-switcher">
        <button className="language-btn active">EN</button>
        <button className="language-btn">SI</button>
        <button className="language-btn">TA</button>
      </div>
      
      <div className="sidebar">
        <h4>Navigation</h4>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/dashboard')}>🏠 Dashboard</a>
          </li>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/apply')}>📋 Apply for PCC</a>
          </li>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/applications')}>📄 My Applications</a>
          </li>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333', fontWeight: 'bold'}} onClick={() => navigate('/profile')}>👤 Profile</a>
          </li>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333'}}>📞 Help & Contact</a>
          </li>
        </ul>
        
        <h4 style={{marginTop: '30px'}}>Quick Guide</h4>
        <p style={{fontSize: '13px', marginTop: '10px'}}>
          <strong>How to Apply:</strong> Complete the form, upload required documents, and submit for review.
        </p>
        <p style={{fontSize: '13px', marginTop: '5px'}}>
          <strong>Processing Time:</strong> 2-3 working days
        </p>
        <p style={{fontSize: '13px', marginTop: '5px', color: '#e74c3c'}}>
          <strong>Note:</strong> Maximum 2 applications allowed per month
        </p>
      </div>
      
      <div className="main-content clearfix">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
          <h3>My Profile</h3>
          <button className="button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </div>
        
        <div className="card">
          <h3>Personal Information</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Name with Initials</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.nameWithInitials || user.nameWithInitials} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name (English)</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.fullNameEnglish || user.fullNameEnglish} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">NIC Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.nicNumber || user.nicNumber} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.dateOfBirth || '2000-05-15'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Permanent Address (as per NIC)</label>
            <textarea 
              className="form-input" 
              value={profileData?.permanentAddress || '123/5, Temple Road, Raddolugama'} 
              readOnly 
              rows="3"
            />
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Police Division</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.policeDivision || 'Raddolugama'} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">GN Division</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileData?.gnDivision || 'Raddolugama North (06-305)'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input 
                type="tel" 
                className="form-input" 
                value={profileData?.mobileNumber || mobile} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={profileData?.email || 'gamini@gmail.com'} 
                readOnly 
              />
            </div>
          </div>
        </div>
        
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <button className="button btn-primary">Edit Profile</button>
          <button className="button" style={{background: '#95a5a6', color: 'white', marginLeft: '10px'}}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;