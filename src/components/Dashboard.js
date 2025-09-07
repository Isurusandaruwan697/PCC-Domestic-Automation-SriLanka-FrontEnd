import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const Dashboard = ({ user, mobile, onLogout }) => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [applicationsThisMonth, setApplicationsThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    fetchDashboardData();
  }, [mobile]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/${mobile}?t=${Date.now()}`);
      
      if (response.data.success) {
        setApplications(response.data.applications);
        setNotifications(response.data.notifications);
        setApplicationsThisMonth(response.data.applicationsThisMonth);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/${mobile}?t=${Date.now()}`);
      
      if (response.data.success) {
        setApplications(response.data.applications);
        setNotifications(response.data.notifications);
        setApplicationsThisMonth(response.data.applicationsThisMonth);
        alert('Dashboard data refreshed successfully!');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Error refreshing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge status-approved">Approved</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">Rejected</span>;
      case 'processing':
        return <span className="status-badge status-processing">Processing</span>;
      default:
        return <span className="status-badge status-pending">Under Review</span>;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header user={user} mobile={mobile} onLogout={onLogout} />
        <div className="main-content">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header user={user} mobile={mobile} onLogout={onLogout} />
      
      <div className="language-switcher">
        <button className="language-btn active">EN</button>
        <button className="language-btn">SI</button>
        <button className="language-btn">TA</button>
        
      </div>
      
      <div className="sidebar">
        <h4>Navigation</h4>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/dashboard')}>🏠 Dashboard</a></li>
          <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/apply')}>📋 Apply for PCC</a></li>
          <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/applications')}>📄 My Applications</a></li>
          <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/profile')}>👤 Profile</a></li>
          <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}}>📞 Help & Contact</a></li>
        </ul>
        
        <h4 style={{marginTop: '30px'}}>Quick Guide</h4>
        <p style={{fontSize: '13px', marginTop: '10px'}}>
          <strong>How to Apply:</strong> Complete the form, upload required documents, and submit for review.
        </p>
        <p style={{fontSize: '13px', marginTop: '5px'}}>
          <strong>Processing Time:</strong> 2-3 working days
        </p>
        <p style={{fontSize: '13px', marginTop: '5px', color: '#e74c3c'}}>
          <strong>Note:</strong> Maximum 2 applications allowed per month. You have {2 - applicationsThisMonth} remaining.
        </p>
      </div>
      
      <div className="main-content clearfix">
        <h3>Dashboard Overview</h3>
        
        <div style={{margin: '20px 0'}}>
          <Link 
            to="/apply" 
            className="button btn-primary" 
            style={{fontSize: '18px', padding: '15px 30px', textDecoration: 'none', display: 'inline-block'}}
            disabled={applicationsThisMonth >= 2}
          >
            ✚ Apply for New PCC
          </Link>
          {applicationsThisMonth >= 2 && (
            <div className="error-message" style={{marginTop: '10px'}}>
              You have reached the maximum of 2 applications this month. Please try again next month.
            </div>
          )}
        </div>
        
        <h4>Recent Applications</h4>
        
        {applications.length === 0 ? (
          <div className="card">
            <p>No applications found. Submit your first application to get started.</p>
          </div>
        ) : (
          applications.map(app => (
            <div className="card" key={app.applicationId}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                <div style={{marginBottom: '10px'}}>
                  <strong>Application #{app.applicationId}</strong><br />
                  <small>Submitted: {new Date(app.submissionDate).toLocaleDateString()}</small><br />
                  <small>Reason: {app.reason}</small>
                </div>
                <div>
                  {getStatusBadge(app.status)}
                  <button 
                    className="button" 
                    onClick={() => navigate(`/application-status/${app.applicationId}`)}
                    style={{marginLeft: '10px'}}
                  >
                    View Status
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        
        <h4>Notifications</h4>
        
        {notifications.length === 0 ? (
          <div className="card">
            <p>No notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div className="notification-item" key={index}>
              <strong>{notification.type === 'certificate_ready' ? 'Certificate Ready' : 'Application Update'}</strong><br />
              {notification.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;