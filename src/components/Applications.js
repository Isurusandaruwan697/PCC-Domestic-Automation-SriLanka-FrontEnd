import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const Applications = ({ user, mobile }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [mobile]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/${mobile}`);
      
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationDocuments = async (appId) => {
    setDocumentsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/documents/${appId}`);
      
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setDocumentsLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#27ae60';
      case 'rejected':
        return '#e74c3c';
      case 'processing':
        return '#f39c12';
      default:
        return '#3498db';
    }
  };

  const viewApplicationDetails = async (application) => {
    setSelectedApp(application);
    await fetchApplicationDocuments(application.applicationId);
  };

  const closeApplicationDetails = () => {
    setSelectedApp(null);
    setDocuments([]);
  };

  const downloadDocument = (document) => {
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${document.filePath}`;
    link.download = document.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeApplicationDetails();
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header user={user} />
        <div className="main-content">
          <p>Loading applications...</p>
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
            <a href="#" style={{textDecoration: 'none', color: '#333', fontWeight: 'bold'}} onClick={() => navigate('/applications')}>📄 My Applications</a>
          </li>
          <li style={{padding: '8px 0'}}>
            <a href="#" style={{textDecoration: 'none', color: '#333'}} onClick={() => navigate('/profile')}>👤 Profile</a>
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
          <h3>My Applications</h3>
          <button className="button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </div>
        
        {applications.length === 0 ? (
          <div className="card">
            <div style={{textAlign: 'center', padding: '30px'}}>
              <h4>No Applications Found</h4>
              <p>You haven't submitted any applications yet.</p>
              <button className="button btn-primary" onClick={() => navigate('/apply')}>
                Apply for PCC
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #ecf0f1'}}>
                  <th style={{padding: '12px', textAlign: 'left'}}>Application ID</th>
                  <th style={{padding: '12px', textAlign: 'left'}}>Submitted Date</th>
                  <th style={{padding: '12px', textAlign: 'left'}}>Reason</th>
                  <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
                  <th style={{padding: '12px', textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.applicationId} style={{borderBottom: '1px solid #ecf0f1'}}>
                    <td style={{padding: '12px'}}>{app.applicationId}</td>
                    <td style={{padding: '12px'}}>
                      {new Date(app.submissionDate).toLocaleDateString()}
                    </td>
                    <td style={{padding: '12px'}}>{app.reasonText || app.reason}</td>
                    <td style={{padding: '12px'}}>
                      {getStatusBadge(app.status)}
                    </td>
                    <td style={{padding: '12px', textAlign: 'center'}}>
                      <button 
                        className="button" 
                        onClick={() => viewApplicationDetails(app)}
                        style={{marginRight: '5px'}}
                      >
                        View 
                      </button>
                      {app.status === 'approved' && (
                        <button className="button btn-success">
                          Download Certificate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Application Status Modal - Now properly centered */}
        {selectedApp && (
          <div className="modal" style={{display: 'flex'}} onClick={handleOverlayClick}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>Application Status - #{selectedApp.applicationId}</h3>
                <button className="close-modal" onClick={closeApplicationDetails}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Application ID</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={selectedApp.applicationId} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Submission Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={new Date(selectedApp.submissionDate).toLocaleDateString()} 
                      readOnly 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={selectedApp.reasonText || selectedApp.reason} 
                    readOnly 
                  />
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={selectedApp.fromDate} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={selectedApp.toDate} 
                      readOnly 
                    />
                  </div>
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Police Division</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={selectedApp.policeDivision} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GN Division</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={selectedApp.gnDivision} 
                      readOnly 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div style={{marginTop: '5px'}}>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                </div>
                
                {/* Application Timeline */}
                <h4>Application Timeline</h4>
                <div className="timeline">
                  {selectedApp.timeline && selectedApp.timeline.map((step, index) => (
                    <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: step.completed ? getStatusColor(selectedApp.status) : '#bdc3c7',
                          marginRight: '10px',
                          border: '2px solid white',
                          boxShadow: '0 0 0 2px #bdc3c7'
                        }}></div>
                        <div>
                          <strong>{step.step}</strong>
                          <p style={{margin: '5px 0', color: '#7f8c8d'}}>
                            {new Date(step.date).toLocaleDateString()} - {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Uploaded Documents */}
                <h4>Uploaded Documents</h4>
                {documentsLoading ? (
                  <p>Loading documents...</p>
                ) : documents.length > 0 ? (
                  <div className="grid-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <strong>
                              {doc.documentType === 'nic' && 'NIC Document'}
                              {doc.documentType === 'birthCert' && 'Birth Certificate'}
                              {doc.documentType === 'gnCert' && 'GN Certification'}
                              {doc.documentType === 'supportLetter' && 'Support Letter'}
                            </strong>
                            <p style={{margin: '5px 0', fontSize: '14px', color: '#7f8c8d'}}>
                              {doc.originalName}
                            </p>
                            <p style={{margin: '0', fontSize: '12px', color: '#95a5a6'}}>
                              {Math.round(doc.fileSize / 1024)} KB
                            </p>
                          </div>
                          <button 
                            className="button btn-primary"
                            onClick={() => downloadDocument(doc)}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No documents found for this application.</p>
                )}
                
                <div style={{textAlign: 'center', marginTop: '20px'}}>
                  <button className="button" onClick={closeApplicationDetails}>Close</button>
                  {selectedApp.status === 'approved' && (
                    <button className="button btn-success" style={{marginLeft: '10px'}}>
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;