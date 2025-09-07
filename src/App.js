import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Otp from './components/Otp';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import Applications from './components/Applications';
import Profile from './components/Profile';
import ApplicationStatus from './components/ApplicationStatus';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pccUser');
    const savedMobile = localStorage.getItem('pccMobile');
    
    if (savedUser && savedMobile) {
      setUser(JSON.parse(savedUser));
      setMobile(savedMobile);
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (userData, mobileNumber) => {
    // Clear any cached data first
    localStorage.removeItem('pccUser');
    localStorage.removeItem('pccMobile');
    
    setUser(userData);
    setMobile(mobileNumber);
    setIsAuthenticated(true);
    localStorage.setItem('pccUser', JSON.stringify(userData));
    localStorage.setItem('pccMobile', mobileNumber);
  };

  const handleLogout = () => {
    setUser(null);
    setMobile('');
    setIsAuthenticated(false);
    localStorage.removeItem('pccUser');
    localStorage.removeItem('pccMobile');
  };

  // Show loading while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="App" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/otp" 
            element={
              !isAuthenticated ? (
                <Otp onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard user={user} mobile={mobile} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/apply" 
            element={
              isAuthenticated ? (
                <ApplicationForm user={user} mobile={mobile} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/applications" 
            element={
              isAuthenticated ? (
                <Applications user={user} mobile={mobile} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/application-status/:appId" 
            element={
              isAuthenticated ? (
                <ApplicationStatus user={user} mobile={mobile} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? (
                <Profile user={user} mobile={mobile} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Redirect root path to login instead of dashboard */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all route for undefined paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;