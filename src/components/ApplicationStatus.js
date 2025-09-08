// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Header from './Header';

// const ApplicationStatus = ({ user, mobile, onLogout }) => {
//   const [application, setApplication] = useState(null);
//   const [statusInfo, setStatusInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { appId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchApplicationStatus();
//   }, [appId]);

//   const fetchApplicationStatus = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/application-status/${appId}`);
      
//       if (response.data.success) {
//         setApplication(response.data.application);
//         setStatusInfo(response.data.statusInfo);
//       } else {
//         setError('Application not found');
//       }
//     } catch (err) {
//       console.error('Error fetching application status:', err);
//       setError('Failed to load application status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'approved':
//         return <span className="status-badge status-approved">Approved</span>;
//       case 'rejected':
//         return <span className="status-badge status-rejected">Rejected</span>;
//       case 'processing':
//         return <span className="status-badge status-processing">Processing</span>;
//       default:
//         return <span className="status-badge status-pending">Under Review</span>;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="container">
//         <Header user={user} mobile={mobile} onLogout={onLogout} />
//         <div className="main-content">
//           <p>Loading application status...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container">
//         <Header user={user} mobile={mobile} onLogout={onLogout} />
//         <div className="main-content">
//           <div className="error-message">{error}</div>
//           <button className="button" onClick={() => navigate('/applications')}>
//             ← Back to Applications
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <Header user={user} mobile={mobile} onLogout={onLogout} />
      
//       <div className="language-switcher">
//         <button className="language-btn active">EN</button>
//         <button className="language-btn">SI</button>
//         <button className="language-btn">TA</button>
//       </div>
      
//       <div className="sidebar">
//         <h4>Navigation</h4>
//         <ul style={{listStyle: 'none', padding: 0}}>
//           <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/dashboard')}>🏠 Dashboard</a></li>
//           <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/apply')}>📋 Apply for PCC</a></li>
//           <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/applications')}>📄 My Applications</a></li>
//           <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/profile')}>👤 Profile</a></li>
//           <li style={{padding: '8px 0'}}><a href="#" style={{textDecoration: 'none', color: '#333'}}>📞 Help & Contact</a></li>
//         </ul>
        
//         <h4 style={{marginTop: '30px'}}>Application Info</h4>
//         <p style={{fontSize: '13px', marginTop: '10px'}}>
//           <strong>ID:</strong> {application.applicationId}
//         </p>
//         <p style={{fontSize: '13px', marginTop: '5px'}}>
//           <strong>Submitted:</strong> {formatDate(application.submissionDate)}
//         </p>
//         <p style={{fontSize: '13px', marginTop: '5px'}}>
//           <strong>Reason:</strong> {application.reasonText}
//         </p>
//       </div>
      
//       <div className="main-content clearfix">
//         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
//           <h3>Application Status - #{application.applicationId}</h3>
//           <button className="button" onClick={() => navigate('/applications')}>← Back to Applications</button>
//         </div>
        
//         <div className="card">
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
//             <div style={{marginBottom: '10px'}}>
//               <strong>Application #{application.applicationId}</strong><br />
//               <small>Submitted: {formatDate(application.submissionDate)}</small><br />
//               <small>Reason: {application.reasonText}</small>
//             </div>
//             <div>
//               {getStatusBadge(application.status)}
//               {application.status === 'approved' && (
//                 <button className="button btn-success" style={{marginLeft: '10px'}}>
//                   Download Certificate
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="card" style={{background: '#f8f9fa', marginBottom: '20px'}}>
//           <div style={{textAlign: 'center', padding: '20px'}}>
//             <div style={{fontSize: '48px', marginBottom: '10px'}}>
//               {statusInfo.icon}
//             </div>
//             <h3 style={{color: statusInfo.color, marginBottom: '10px'}}>
//               {statusInfo.title}
//             </h3>
//             <p>{statusInfo.description}</p>
//             <small style={{color: '#7f8c8d'}}>
//               Last updated: {formatDate(statusInfo.lastUpdated)}
//             </small>
//           </div>
//         </div>
        
//         <h3>Application Progress</h3>
//         <div className="timeline">
//           {application.timeline && application.timeline.map((step, index) => (
//             <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''} ${index === 0 ? 'active' : ''}`}>
//               <strong>{step.step}</strong>
//               <p>{formatDate(step.date)}</p>
//               {step.officer && (
//                 <div className="officer-info">
//                   Officer: {step.officer}
//                 </div>
//               )}
//               {step.description && (
//                 <div style={{fontSize: '14px', color: '#7f8c8d', marginTop: '5px'}}>
//                   {step.description}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
        
//         <h4 style={{marginTop: '30px'}}>Application Details</h4>
//         <div className="grid-2">
//           <div className="card">
//             <h5>Personal Information</h5>
//             <p><strong>Name:</strong> {application.fullNameEnglish}</p>
//             <p><strong>NIC:</strong> {application.nicNumber}</p>
//             <p><strong>Mobile:</strong> {application.mobileNumber}</p>
//           </div>
          
//           <div className="card">
//             <h5>Processing Information</h5>
//             <p><strong>Police Division:</strong> {application.policeDivision}</p>
//             <p><strong>GN Division:</strong> {application.gnDivision}</p>
//             <p><strong>Period:</strong> {application.fromDate} to {application.toDate}</p>
//           </div>
//         </div>
        
//         <h4 style={{marginTop: '30px'}}>Uploaded Documents</h4>
//         <div className="document-grid">
//           {application.documents.nic && (
//             <div className="document-card">
//               <strong>NIC Copy</strong>
//               <div className="file-info">
//                 <span>{application.documents.nic.originalName}</span>
//                 <button className="button" style={{marginTop: '10px'}}>View</button>
//               </div>
//             </div>
//           )}
          
//           {application.documents.birthCert && (
//             <div className="document-card">
//               <strong>Birth Certificate</strong>
//               <div className="file-info">
//                 <span>{application.documents.birthCert.originalName}</span>
//                 <button className="button" style={{marginTop: '10px'}}>View</button>
//               </div>
//             </div>
//           )}
          
//           {application.documents.gnCert && (
//             <div className="document-card">
//               <strong>GN Certification</strong>
//               <div className="file-info">
//                 <span>{application.documents.gnCert.originalName}</span>
//                 <button className="button" style={{marginTop: '10px'}}>View</button>
//               </div>
//             </div>
//           )}
          
//           {application.documents.supportLetter && (
//             <div className="document-card">
//               <strong>Supporting Letter</strong>
//               <div className="file-info">
//                 <span>{application.documents.supportLetter.originalName}</span>
//                 <button className="button" style={{marginTop: '10px'}}>View</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicationStatus;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const ApplicationStatus = ({ user, mobile, onLogout }) => {
  const [application, setApplication] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { appId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationStatus();
    // Set up polling to check for status updates
    const interval = setInterval(fetchApplicationStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [appId]);

  const fetchApplicationStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/application-status/${appId}`);
      
      if (response.data.success) {
        setApplication(response.data.application);
        setStatusInfo(response.data.statusInfo);
      } else {
        setError('Application not found');
      }
    } catch (err) {
      console.error('Error fetching application status:', err);
      if (err.response?.status !== 404) {
        setError('Failed to load application status');
      }
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
      case 'criminal_check':
        return <span className="status-badge status-criminal-check">Criminal Check</span>;
      default:
        return <span className="status-badge status-submitted">Submitted</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <Header user={user} mobile={mobile} onLogout={onLogout} />
        <div className="main-content">
          <p>Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header user={user} mobile={mobile} onLogout={onLogout} />
        <div className="main-content">
          <div className="error-message">{error}</div>
          <button className="button" onClick={() => navigate('/applications')}>
            ← Back to Applications
          </button>
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
        
        <h4 style={{marginTop: '30px'}}>Application Info</h4>
        <p style={{fontSize: '13px', marginTop: '10px'}}>
          <strong>ID:</strong> {application.applicationId}
        </p>
        <p style={{fontSize: '13px', marginTop: '5px'}}>
          <strong>Submitted:</strong> {formatDate(application.submissionDate)}
        </p>
        <p style={{fontSize: '13px', marginTop: '5px'}}>
          <strong>Reason:</strong> {application.reasonText}
        </p>
        <p style={{fontSize: '13px', marginTop: '5px'}}>
          <strong>Status:</strong> {getStatusBadge(application.status)}
        </p>
      </div>
      
      <div className="main-content clearfix">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
          <h3>Application Status - #{application.applicationId}</h3>
          <button className="button" onClick={() => navigate('/applications')}>← Back to Applications</button>
        </div>
        
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
            <div style={{marginBottom: '10px'}}>
              <strong>Application #{application.applicationId}</strong><br />
              <small>Submitted: {formatDate(application.submissionDate)}</small><br />
              <small>Reason: {application.reasonText}</small>
            </div>
            <div>
              {getStatusBadge(application.status)}
              {application.status === 'approved' && (
                <button className="button btn-success" style={{marginLeft: '10px'}}>
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="card" style={{background: '#f8f9fa', marginBottom: '20px'}}>
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}>
              {statusInfo.icon}
            </div>
            <h3 style={{color: statusInfo.color, marginBottom: '10px'}}>
              {statusInfo.title}
            </h3>
            <p>{statusInfo.description}</p>
            <small style={{color: '#7f8c8d'}}>
              Last updated: {formatDate(statusInfo.lastUpdated)}
            </small>
          </div>
        </div>
        
        <h3>Application Progress</h3>
        <div className="timeline">
          {application.timeline && application.timeline.map((step, index) => (
            <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''} ${index === application.timeline.length - 1 ? 'active' : ''}`}>
              <div className="timeline-icon">
                {step.step === "Submitted" && "📤"}
                {step.step === "Criminal Check" && "🔍"}
                {step.step === "Criminal Check Complete" && "✅"}
                {step.step === "Processing" && "⚙️"}
              </div>
              <div className="timeline-content">
                <strong>{step.step}</strong>
                <p>{formatDate(step.date)}</p>
                {step.officer && (
                  <div className="officer-info">
                    Officer: {step.officer}
                  </div>
                )}
                {step.description && (
                  <div style={{fontSize: '14px', color: '#7f8c8d', marginTop: '5px'}}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <h4 style={{marginTop: '30px'}}>Application Details</h4>
        <div className="grid-2">
          <div className="card">
            <h5>Personal Information</h5>
            <p><strong>Name:</strong> {application.fullNameEnglish}</p>
            <p><strong>NIC:</strong> {application.nicNumber}</p>
            <p><strong>Mobile:</strong> {application.mobileNumber}</p>
          </div>
          
          <div className="card">
            <h5>Processing Information</h5>
            <p><strong>Police Division:</strong> {application.policeDivision}</p>
            <p><strong>GN Division:</strong> {application.gnDivision}</p>
            <p><strong>Period:</strong> {application.fromDate} to {application.toDate}</p>
          </div>
        </div>
        
        <h4 style={{marginTop: '30px'}}>Uploaded Documents</h4>
        <div className="document-grid">
          {application.documents.nic && (
            <div className="document-card">
              <strong>NIC Copy</strong>
              <div className="file-info">
                <span>{application.documents.nic.originalName}</span>
                <button className="button" style={{marginTop: '10px'}}>View</button>
              </div>
            </div>
          )}
          
          {application.documents.birthCert && (
            <div className="document-card">
              <strong>Birth Certificate</strong>
              <div className="file-info">
                <span>{application.documents.birthCert.originalName}</span>
                <button className="button" style={{marginTop: '10px'}}>View</button>
              </div>
            </div>
          )}
          
          {application.documents.gnCert && (
            <div className="document-card">
              <strong>GN Certification</strong>
              <div className="file-info">
                <span>{application.documents.gnCert.originalName}</span>
                <button className="button" style={{marginTop: '10px'}}>View</button>
              </div>
            </div>
          )}
          
          {application.documents.supportLetter && (
            <div className="document-card">
              <strong>Supporting Letter</strong>
              <div className="file-info">
                <span>{application.documents.supportLetter.originalName}</span>
                <button className="button" style={{marginTop: '10px'}}>View</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;