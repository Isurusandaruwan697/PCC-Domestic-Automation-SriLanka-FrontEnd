// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Header from './Header';

// const ApplicationForm = ({ user, mobile }) => {
//   const [formData, setFormData] = useState({
//     reason: '',
//     policeDivision: '',
//     gnDivision: '',
//     fromDate: '2019-01-01',
//     toDate: new Date().toISOString().split('T')[0]
//   });
//   const [files, setFiles] = useState({
//     nic: null,
//     birthCert: null,
//     gnCert: null,
//     supportLetter: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [applicationsThisMonth, setApplicationsThisMonth] = useState(0);
//   const [remainingApplications, setRemainingApplications] = useState(2);
//   const navigate = useNavigate();

//   const reasonRequirements = {
//     "local_job": [
//       "National Identity Card (NIC)",
//       "Birth certificate",
//       "Proof of address (utility bill / residence certificate / GN certification)",
//       "Employer request letter or job offer letter"
//     ],
//     "higher_education": [
//       "National Identity Card (NIC)",
//       "Birth certificate",
//       "Proof of address",
//       "University admission/acceptance letter"
//     ],
//     "work_contract": [
//       "National Identity Card (NIC)",
//       "Birth certificate",
//       "Proof of address",
//       "Organization/NGO request letter or contract"
//     ],
//     "legal_matters": [
//       "National Identity Card (NIC)",
//       "Birth certificate",
//       "Proof of address",
//       "Court order or court request letter"
//     ],
//     "adoption": [
//       "National Identity Card (NIC)",
//       "Birth certificate",
//       "Marriage certificate (if applicable)",
//       "Proof of address",
//       "Adoption agency/court request letter"
//     ]
//   };

//   const reasonDisplayNames = {
//     "local_job": "Local Job (Employment within Sri Lanka)",
//     "higher_education": "Higher Education (Local or Abroad)",
//     "work_contract": "Work Contracts / Volunteering",
//     "legal_matters": "Legal Matters",
//     "adoption": "Adoption Process"
//   };

//   const policeDivisions = {
//     "seeduwa": "Seeduwa Police Division",
//     "raddolugama": "Raddolugama Police Division",
//     "negombo": "Negombo Police Division",
//     "ja-ela": "Ja-ela Police Division"
//   };

//   const gnDivisions = {
//     "seeduwa": [
//       {code: "147", name: "Seeduwa (Central)"},
//       {code: "", name: "Seeduwa West"},
//       {code: "", name: "Seeduwa East"},
//       {code: "203", name: "Ganepola"},
//       {code: "200", name: "Thanpala (Thempala)"},
//       {code: "204", name: "Kotugoda"},
//       {code: "204A", name: "Lansiyawadiya"},
//       {code: "144A", name: "Liyanagemulla North"},
//       {code: "144", name: "Liyanagemulla South"},
//       {code: "201", name: "Muthuwadiya"}
//     ],
//     "raddolugama": [
//       {code: "06-300", name: "Raddolugama North A"},
//       {code: "06-305", name: "Raddolugama North"},
//       {code: "06-310", name: "Raddolugama South"},
//       {code: "06-315", name: "Raddolugama South A"},
//       {code: "06-320", name: "Raddoluwa North"},
//       {code: "06-325", name: "Raddoluwa West"},
//       {code: "06-360", name: "Raddoluwa South"}
//     ],
//     "negombo": [
//       {code: "06-100", name: "Negombo Central"},
//       {code: "06-105", name: "Negombo North"},
//       {code: "06-110", name: "Negombo South"},
//       {code: "06-115", name: "Negombo East"}
//     ],
//     "ja-ela": [
//       {code: "06-200", name: "Ja-ela Central"},
//       {code: "06-205", name: "Ja-ela North"},
//       {code: "06-210", name: "Ja-ela South"},
//       {code: "06-215", name: "Ja-ela East"}
//     ]
//   };

//   useEffect(() => {
//     fetchApplicationsCount();
//   }, [mobile]);

//   const fetchApplicationsCount = async () => {
//     try {
//       // Add timestamp to prevent caching
//       const response = await axios.get(`http://localhost:5000/api/dashboard/${mobile}?t=${Date.now()}`);
//       if (response.data.success) {
//         setApplicationsThisMonth(response.data.applicationsThisMonth);
//         setRemainingApplications(2 - response.data.applicationsThisMonth);
//       }
//     } catch (error) {
//       console.error('Error fetching applications count:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (fileType, e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
      
//       if (file.size > 2 * 1024 * 1024) {
//         alert('File size exceeds 2MB limit');
//         return;
//       }
      
//       setFiles(prev => ({
//         ...prev,
//         [fileType]: file
//       }));
      
//       const area = document.getElementById(`${fileType}UploadArea`);
//       const preview = document.getElementById(`${fileType}Preview`);
      
//       area.classList.add('has-file');
//       preview.innerHTML = `
//         <div class="file-info">
//           <span>${file.name} (${formatFileSize(file.size)})</span>
//           <span class="remove-file" onclick="removeFile('${fileType}')">Remove</span>
//         </div>
//       `;
//     }
//   };

//   const removeFile = (fileType) => {
//     setFiles(prev => ({
//       ...prev,
//       [fileType]: null
//     }));
    
//     const area = document.getElementById(`${fileType}UploadArea`);
//     const preview = document.getElementById(`${fileType}Preview`);
    
//     area.classList.remove('has-file');
//     preview.innerHTML = '';
    
//     // Reset file input
//     document.getElementById(`${fileType}Upload`).value = '';
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + ' bytes';
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//     else return (bytes / 1048576).toFixed(1) + ' MB';
//   };

//   const triggerUpload = (inputId) => {
//     document.getElementById(inputId).click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check application limit
//     if (applicationsThisMonth >= 2) {
//       setError('You have reached the maximum of 2 applications this month. Please try again next month.');
//       return;
//     }
    
//     // Validate form
//     const { reason, policeDivision, gnDivision, fromDate, toDate } = formData;
//     const { nic, birthCert, gnCert } = files;
    
//     if (!reason || !policeDivision || !gnDivision || !fromDate || !toDate) {
//       setError('Please fill all required fields');
//       return;
//     }
    
//     if (!nic || !birthCert || !gnCert) {
//       setError('Please upload all required documents');
//       return;
//     }
    
//     if (!document.getElementById('confirmCheckbox').checked) {
//       setError('Please confirm that all information is accurate');
//       return;
//     }
    
//     setLoading(true);
//     setError('');

//     try {
//       // First upload files
//       const formDataObj = new FormData();
//       if (files.nic) formDataObj.append('nic', files.nic);
//       if (files.birthCert) formDataObj.append('birthCert', files.birthCert);
//       if (files.gnCert) formDataObj.append('gnCert', files.gnCert);
//       if (files.supportLetter) formDataObj.append('supportLetter', files.supportLetter);

//       const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataObj, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (uploadResponse.data.success) {
//         // Then submit application with file references
//         const applicationData = {
//           reason,
//           policeDivision,
//           gnDivision,
//           fromDate,
//           toDate
//         };

//         const response = await axios.post('http://localhost:5000/api/application', {
//           mobile,
//           applicationData,
//           uploadedFiles: uploadResponse.data.files
//         });
        
//         if (response.data.success) {
//           console.log('📋 Application Submission:', {
//             timestamp: new Date().toISOString(),
//             applicationId: response.data.applicationId,
//             policeDivision: policeDivisions[policeDivision],
//             message: `Application submitted and sent to ${policeDivisions[policeDivision]} Police Division`,
//             files: Object.keys(uploadResponse.data.files)
//           });
          
//           alert('Application submitted successfully!');
//           navigate('/dashboard');
//         } else {
//           setError(response.data.message);
//         }
//       } else {
//         setError(uploadResponse.data.message);
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       setError(err.response?.data?.message || 'An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add global function for file removal
//   useEffect(() => {
//     window.removeFile = removeFile;
//     return () => {
//       delete window.removeFile;
//     };
//   }, []);

//   return (
//     <div className="container">
//       <Header user={user} mobile={mobile} />
      
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
        
//         <h4 style={{marginTop: '30px'}}>Quick Guide</h4>
//         <p style={{fontSize: '13px', marginTop: '10px'}}>
//           <strong>How to Apply:</strong> Complete the form, upload required documents, and submit for review.
//         </p>
//         <p style={{fontSize: '13px', marginTop: '5px'}}>
//           <strong>Processing Time:</strong> 2-3 working days
//         </p>
//         <p style={{fontSize: '13px', marginTop: '5px', color: '#e74c3c'}}>
//           <strong>Note:</strong> Maximum 2 applications allowed per month
//         </p>
//       </div>
      
//       <div className="main-content clearfix">
//         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
//           <h3>Apply for Police Clearance Certificate</h3>
//           <button className="button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
//         </div>
        
//         <div className="card" style={{background: '#f8f9fa', marginBottom: '20px'}}>
//           <h4>Instructions</h4>
//           <p style={{marginTop: '10px'}}>
//             Please fill all required fields (marked with *) and upload clear copies of your documents. 
//             Applications with incomplete information will be rejected.
//           </p>
//           <p style={{marginTop: '10px', color: '#e74c3c'}}>
//             <strong>Note:</strong> You can only submit 2 applications per month. You have <span id="remainingApplications">{remainingApplications}</span> applications remaining this month.
//           </p>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <h3>Personal Information</h3>
//           <div className="grid-2">
//             <div className="form-group">
//               <label className="form-label">Name with Initials *</label>
//               <input 
//                 type="text" 
//                 className="form-input" 
//                 id="nameWithInitials"
//                 value={user.nameWithInitials} 
//                 readOnly 
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Full Name (English) *</label>
//               <input 
//                 type="text" 
//                 className="form-input" 
//                 id="fullNameEnglish"
//                 value={user.fullNameEnglish} 
//                 readOnly 
//               />
//             </div>
//           </div>
          
//           <div className="grid-2">
//             <div className="form-group">
//               <label className="form-label">NIC Number *</label>
//               <input 
//                 type="text" 
//                 className="form-input" 
//                 id="nicNumber"
//                 value={user.nicNumber} 
//                 readOnly 
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Date of Birth *</label>
//               <input 
//                 type="text" 
//                 className="form-input" 
//                 id="dob"
//                 value={user.dateOfBirth} 
//                 readOnly 
//               />
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label className="form-label">Permanent Address (as per NIC) *</label>
//             <textarea 
//               className="form-input" 
//               id="address"
//               value={user.permanentAddress} 
//               readOnly 
//               rows="3"
//             />
//           </div>
          
//           <h3>Application Details</h3>
//           <div className="form-group">
//             <label className="form-label">Reason for Application *</label>
//             <select 
//               className="form-select" 
//               id="applicationReason"
//               name="reason"
//               value={formData.reason}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Reason</option>
//               <option value="local_job">Local Job (Employment within Sri Lanka)</option>
//               <option value="higher_education">Higher Education (Local or Abroad)</option>
//               <option value="work_contract">Work Contracts / Volunteering</option>
//               <option value="legal_matters">Legal Matters</option>
//               <option value="adoption">Adoption Process</option>
//             </select>
//           </div>
          
//           {formData.reason && (
//             <div id="documentRequirements" className="document-requirements">
//               <h5>Required Documents for Selected Reason</h5>
//               <ul id="requirementsList">
//                 {reasonRequirements[formData.reason].map((req, index) => (
//                   <li key={index}>{req}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
          
//           <h3>Location Information</h3>
//           <div className="form-group">
//             <label className="form-label">Police Division *</label>
//             <select 
//               className="form-select" 
//               id="policeDivision"
//               name="policeDivision"
//               value={formData.policeDivision}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Police Division</option>
//               {Object.keys(policeDivisions).map(key => (
//                 <option key={key} value={key}>{policeDivisions[key]}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label className="form-label">Grama Niladhari Division *</label>
//             <select 
//               className="form-select" 
//               id="gnDivision"
//               name="gnDivision"
//               value={formData.gnDivision}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.policeDivision}
//             >
//               <option value="">Select GN Division</option>
//               {formData.policeDivision && gnDivisions[formData.policeDivision].map((gn, index) => (
//                 <option key={index} value={gn.code ? `${gn.name} (${gn.code})` : gn.name}>
//                   {gn.code ? `${gn.name} (${gn.code})` : gn.name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="grid-2">
//             <div className="form-group">
//               <label className="form-label">From Date *</label>
//               <input 
//                 type="date" 
//                 className="form-input" 
//                 id="fromDate"
//                 name="fromDate"
//                 value={formData.fromDate}
//                 onChange={handleInputChange}
//                 min="1950-01-01" 
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">To Date *</label>
//               <input 
//                 type="date" 
//                 className="form-input" 
//                 id="toDate"
//                 name="toDate"
//                 value={formData.toDate}
//                 onChange={handleInputChange}
//                 min={formData.fromDate}
//                 required
//               />
//             </div>
//           </div>
          
//           <h3>Document Upload</h3>
//           <div className="grid-4">
//             <div className="document-card">
//               <label className="form-label">NIC Copy (Front & Back) *</label>
//               <div className="upload-area" id="nicUploadArea" onClick={() => triggerUpload('nicUpload')}>
//                 <div>📄 Click to upload or drag file here</div>
//                 <small>PDF, JPG, PNG (Max 2MB)</small>
//                 <input 
//                   type="file" 
//                   id="nicUpload" 
//                   style={{display: 'none'}} 
//                   accept=".pdf,.jpg,.jpeg,.png" 
//                   onChange={(e) => handleFileChange('nic', e)}
//                   required
//                 />
//                 <div className="file-preview" id="nicPreview"></div>
//               </div>
//             </div>
            
//             <div className="document-card">
//               <label className="form-label">Birth Certificate *</label>
//               <div className="upload-area" id="birthCertUploadArea" onClick={() => triggerUpload('birthCertUpload')}>
//                 <div>📄 Click to upload or drag file here</div>
//                 <small>PDF, JPG, PNG (Max 2MB)</small>
//                 <input 
//                   type="file" 
//                   id="birthCertUpload" 
//                   style={{display: 'none'}} 
//                   accept=".pdf,.jpg,.jpeg,.png" 
//                   onChange={(e) => handleFileChange('birthCert', e)}
//                   required
//                 />
//                 <div className="file-preview" id="birthCertPreview"></div>
//               </div>
//             </div>
            
//             <div className="document-card">
//               <label className="form-label">Grama Niladhari Certification *</label>
//               <div className="upload-area" id="gnCertUploadArea" onClick={() => triggerUpload('gnCertUpload')}>
//                 <div>📄 Click to upload or drag file here</div>
//                 <small>PDF, JPG, PNG (Max 2MB)</small>
//                 <input 
//                   type="file" 
//                   id="gnCertUpload" 
//                   style={{display: 'none'}} 
//                   accept=".pdf,.jpg,.jpeg,.png" 
//                   onChange={(e) => handleFileChange('gnCert', e)}
//                   required
//                 />
//                 <div className="file-preview" id="gnCertPreview"></div>
//               </div>
//             </div>
            
//             <div className="document-card">
//               <label className="form-label">Supporting Letter (Optional)</label>
//               <div className="upload-area" id="supportLetterUploadArea" onClick={() => triggerUpload('supportLetterUpload')}>
//                 <div>📄 Click to upload or drag file here</div>
//                 <small>PDF, DOC, JPG (Max 2MB)</small>
//                 <input 
//                   type="file" 
//                   id="supportLetterUpload" 
//                   style={{display: 'none'}} 
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg" 
//                   onChange={(e) => handleFileChange('supportLetter', e)}
//                 />
//                 <div className="file-preview" id="supportLetterPreview"></div>
//               </div>
//             </div>
//           </div>
          
//           <div style={{margin: '30px 0', textAlign: 'center'}}>
//             <label>
//               <input type="checkbox" id="confirmCheckbox" defaultChecked /> I confirm that all information provided is accurate
//             </label>
//           </div>
          
//           {error && <div className="error-message" style={{textAlign: 'center', marginBottom: '15px'}}>{error}</div>}
          
//           <div style={{textAlign: 'center'}}>
//             <button 
//               type="submit" 
//               className="button btn-success" 
//               style={{fontSize: '16px', padding: '12px 40px'}} 
//               disabled={loading || applicationsThisMonth >= 2}
//             >
//               {loading ? 'Submitting...' : 'Submit Application'}
//             </button>
//             <button type="button" className="button" style={{background: '#95a5a6', color: 'white'}} onClick={() => navigate('/dashboard')}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const ApplicationForm = ({ user, mobile }) => {
  const [formData, setFormData] = useState({
    reason: '',
    policeDivision: '',
    gnDivision: '',
    fromDate: '2019-01-01',
    toDate: new Date().toISOString().split('T')[0],
    permanentAddress: '' // Added permanent address field
  });
  const [profileData, setProfileData] = useState(null);
  const [files, setFiles] = useState({
    nic: null,
    birthCert: null,
    gnCert: null,
    supportLetter: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationsThisMonth, setApplicationsThisMonth] = useState(0);
  const [remainingApplications, setRemainingApplications] = useState(2);
  const navigate = useNavigate();

  const reasonRequirements = {
    "local_job": [
      "National Identity Card (NIC)",
      "Birth certificate",
      "Proof of address (utility bill / residence certificate / GN certification)",
      "Employer request letter or job offer letter"
    ],
    "higher_education": [
      "National Identity Card (NIC)",
      "Birth certificate",
      "Proof of address",
      "University admission/acceptance letter"
    ],
    "work_contract": [
      "National Identity Card (NIC)",
      "Birth certificate",
      "Proof of address",
      "Organization/NGO request letter or contract"
    ],
    "legal_matters": [
      "National Identity Card (NIC)",
      "Birth certificate",
      "Proof of address",
      "Court order or court request letter"
    ],
    "adoption": [
      "National Identity Card (NIC)",
      "Birth certificate",
      "Marriage certificate (if applicable)",
      "Proof of address",
      "Adoption agency/court request letter"
    ]
  };

  const reasonDisplayNames = {
    "local_job": "Local Job (Employment within Sri Lanka)",
    "higher_education": "Higher Education (Local or Abroad)",
    "work_contract": "Work Contracts / Volunteering",
    "legal_matters": "Legal Matters",
    "adoption": "Adoption Process"
  };

  const policeDivisions = {
    "seeduwa": "Seeduwa Police Division",
    "raddolugama": "Raddolugama Police Division",
    "negombo": "Negombo Police Division",
    "ja-ela": "Ja-ela Police Division"
  };

  const gnDivisions = {
    "seeduwa": [
      {code: "147", name: "Seeduwa (Central)"},
      {code: "", name: "Seeduwa West"},
      {code: "", name: "Seeduwa East"},
      {code: "203", name: "Ganepola"},
      {code: "200", name: "Thanpala (Thempala)"},
      {code: "204", name: "Kotugoda"},
      {code: "204A", name: "Lansiyawadiya"},
      {code: "144A", name: "Liyanagemulla North"},
      {code: "144", name: "Liyanagemulla South"},
      {code: "201", name: "Muthuwadiya"}
    ],
    "raddolugama": [
      {code: "06-300", name: "Raddolugama North A"},
      {code: "06-305", name: "Raddolugama North"},
      {code: "06-310", name: "Raddolugama South"},
      {code: "06-315", name: "Raddolugama South A"},
      {code: "06-320", name: "Raddoluwa North"},
      {code: "06-325", name: "Raddoluwa West"},
      {code: "06-360", name: "Raddoluwa South"}
    ],
    "negombo": [
      {code: "06-100", name: "Negombo Central"},
      {code: "06-105", name: "Negombo North"},
      {code: "06-110", name: "Negombo South"},
      {code: "06-115", name: "Negombo East"}
    ],
    "ja-ela": [
      {code: "06-200", name: "Ja-ela Central"},
      {code: "06-205", name: "Ja-ela North"},
      {code: "06-210", name: "Ja-ela South"},
      {code: "06-215", name: "Ja-ela East"}
    ]
  };

  useEffect(() => {
    fetchApplicationsCount();
    fetchProfileData();
  }, [mobile]);

  const fetchApplicationsCount = async () => {
    try {
      // Add timestamp to prevent caching
      const response = await axios.get(`http://localhost:5000/api/dashboard/${mobile}?t=${Date.now()}`);
      if (response.data.success) {
        setApplicationsThisMonth(response.data.applicationsThisMonth);
        setRemainingApplications(2 - response.data.applicationsThisMonth);
      }
    } catch (error) {
      console.error('Error fetching applications count:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${mobile}`);
      if (response.data.success) {
        setProfileData(response.data.user);
        // Set permanent address from profile data
        setFormData(prev => ({
          ...prev,
          permanentAddress: response.data.user.permanentAddress || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (fileType, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      
      const area = document.getElementById(`${fileType}UploadArea`);
      const preview = document.getElementById(`${fileType}Preview`);
      
      area.classList.add('has-file');
      preview.innerHTML = `
        <div class="file-info">
          <span>${file.name} (${formatFileSize(file.size)})</span>
          <span class="remove-file" onclick="removeFile('${fileType}')">Remove</span>
        </div>
      `;
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
    
    const area = document.getElementById(`${fileType}UploadArea`);
    const preview = document.getElementById(`${fileType}Preview`);
    
    area.classList.remove('has-file');
    preview.innerHTML = '';
    
    // Reset file input
    document.getElementById(`${fileType}Upload`).value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const triggerUpload = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check application limit
    if (applicationsThisMonth >= 2) {
      setError('You have reached the maximum of 2 applications this month. Please try again next month.');
      return;
    }
    
    // Validate form
    const { reason, policeDivision, gnDivision, fromDate, toDate, permanentAddress } = formData;
    const { nic, birthCert, gnCert } = files;
    
    if (!reason || !policeDivision || !gnDivision || !fromDate || !toDate || !permanentAddress) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!nic || !birthCert || !gnCert) {
      setError('Please upload all required documents');
      return;
    }
    
    if (!document.getElementById('confirmCheckbox').checked) {
      setError('Please confirm that all information is accurate');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // First upload files
      const formDataObj = new FormData();
      if (files.nic) formDataObj.append('nic', files.nic);
      if (files.birthCert) formDataObj.append('birthCert', files.birthCert);
      if (files.gnCert) formDataObj.append('gnCert', files.gnCert);
      if (files.supportLetter) formDataObj.append('supportLetter', files.supportLetter);

      const uploadResponse = await axios.post('http://localhost:5000/api/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadResponse.data.success) {
        // Then submit application with file references
        const applicationData = {
          reason,
          policeDivision,
          gnDivision,
          fromDate,
          toDate,
          permanentAddress // Include permanent address in application data
        };

        const response = await axios.post('http://localhost:5000/api/application', {
          mobile,
          applicationData,
          uploadedFiles: uploadResponse.data.files
        });
        
        if (response.data.success) {
          console.log('📋 Application Submission:', {
            timestamp: new Date().toISOString(),
            applicationId: response.data.applicationId,
            policeDivision: policeDivisions[policeDivision],
            message: `Application submitted and sent to ${policeDivisions[policeDivision]} Police Division`,
            files: Object.keys(uploadResponse.data.files)
          });
          
          alert('Application submitted successfully!');
          navigate('/dashboard');
        } else {
          setError(response.data.message);
        }
      } else {
        setError(uploadResponse.data.message);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add global function for file removal
  useEffect(() => {
    window.removeFile = removeFile;
    return () => {
      delete window.removeFile;
    };
  }, []);

  return (
    <div className="container">
      <Header user={user} mobile={mobile} />
      
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
          <strong>Note:</strong> Maximum 2 applications allowed per month
        </p>
      </div>
      
      <div className="main-content clearfix">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
          <h3>Apply for Police Clearance Certificate</h3>
          <button className="button" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </div>
        
        <div className="card" style={{background: '#f8f9fa', marginBottom: '20px'}}>
          <h4>Instructions</h4>
          <p style={{marginTop: '10px'}}>
            Please fill all required fields (marked with *) and upload clear copies of your documents. 
            Applications with incomplete information will be rejected.
          </p>
          <p style={{marginTop: '10px', color: '#e74c3c'}}>
            <strong>Note:</strong> You can only submit 2 applications per month. You have <span id="remainingApplications">{remainingApplications}</span> applications remaining this month.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <h3>Personal Information</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Name with Initials *</label>
              <input 
                type="text" 
                className="form-input" 
                id="nameWithInitials"
                value={user.nameWithInitials} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name (English) *</label>
              <input 
                type="text" 
                className="form-input" 
                id="fullNameEnglish"
                value={user.fullNameEnglish} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">NIC Number *</label>
              <input 
                type="text" 
                className="form-input" 
                id="nicNumber"
                value={user.nicNumber} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input 
                type="text" 
                className="form-input" 
                id="dob"
                value={profileData?.dateOfBirth || user.dateOfBirth || '2000-05-15'} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Permanent Address (as per NIC) *</label>
            <textarea 
              className="form-input" 
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter your permanent address as per your NIC"
              required
            />
          </div>
          
          <h3>Application Details</h3>
          <div className="form-group">
            <label className="form-label">Reason for Application *</label>
            <select 
              className="form-select" 
              id="applicationReason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Reason</option>
              <option value="local_job">Local Job (Employment within Sri Lanka)</option>
              <option value="higher_education">Higher Education (Local or Abroad)</option>
              <option value="work_contract">Work Contracts / Volunteering</option>
              <option value="legal_matters">Legal Matters</option>
              <option value="adoption">Adoption Process</option>
            </select>
          </div>
          
          {formData.reason && (
            <div id="documentRequirements" className="document-requirements">
              <h5>Required Documents for Selected Reason</h5>
              <ul id="requirementsList">
                {reasonRequirements[formData.reason].map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          <h3>Location Information</h3>
          <div className="form-group">
            <label className="form-label">Police Division *</label>
            <select 
              className="form-select" 
              id="policeDivision"
              name="policeDivision"
              value={formData.policeDivision}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Police Division</option>
              {Object.keys(policeDivisions).map(key => (
                <option key={key} value={key}>{policeDivisions[key]}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Grama Niladhari Division *</label>
            <select 
              className="form-select" 
              id="gnDivision"
              name="gnDivision"
              value={formData.gnDivision}
              onChange={handleInputChange}
              required
              disabled={!formData.policeDivision}
            >
              <option value="">Select GN Division</option>
              {formData.policeDivision && gnDivisions[formData.policeDivision].map((gn, index) => (
                <option key={index} value={gn.code ? `${gn.name} (${gn.code})` : gn.name}>
                  {gn.code ? `${gn.name} (${gn.code})` : gn.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">From Date *</label>
              <input 
                type="date" 
                className="form-input" 
                id="fromDate"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                min="1950-01-01" 
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date *</label>
              <input 
                type="date" 
                className="form-input" 
                id="toDate"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                min={formData.fromDate}
                required
              />
            </div>
          </div>
          
          <h3>Document Upload</h3>
          <div className="grid-4">
            <div className="document-card">
              <label className="form-label">NIC Copy (Front & Back) *</label>
              <div className="upload-area" id="nicUploadArea" onClick={() => triggerUpload('nicUpload')}>
                <div>📄 Click to upload or drag file here</div>
                <small>PDF, JPG, PNG (Max 2MB)</small>
                <input 
                  type="file" 
                  id="nicUpload" 
                  style={{display: 'none'}} 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => handleFileChange('nic', e)}
                  required
                />
                <div className="file-preview" id="nicPreview"></div>
              </div>
            </div>
            
            <div className="document-card">
              <label className="form-label">Birth Certificate *</label>
              <div className="upload-area" id="birthCertUploadArea" onClick={() => triggerUpload('birthCertUpload')}>
                <div>📄 Click to upload or drag file here</div>
                <small>PDF, JPG, PNG (Max 2MB)</small>
                <input 
                  type="file" 
                  id="birthCertUpload" 
                  style={{display: 'none'}} 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => handleFileChange('birthCert', e)}
                  required
                />
                <div className="file-preview" id="birthCertPreview"></div>
              </div>
            </div>
            
            <div className="document-card">
              <label className="form-label">Grama Niladhari Certification *</label>
              <div className="upload-area" id="gnCertUploadArea" onClick={() => triggerUpload('gnCertUpload')}>
                <div>📄 Click to upload or drag file here</div>
                <small>PDF, JPG, PNG (Max 2MB)</small>
                <input 
                  type="file" 
                  id="gnCertUpload" 
                  style={{display: 'none'}} 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => handleFileChange('gnCert', e)}
                  required
                />
                <div className="file-preview" id="gnCertPreview"></div>
              </div>
            </div>
            
            <div className="document-card">
              <label className="form-label">Supporting Letter (Optional)</label>
              <div className="upload-area" id="supportLetterUploadArea" onClick={() => triggerUpload('supportLetterUpload')}>
                <div>📄 Click to upload or drag file here</div>
                <small>PDF, DOC, JPG (Max 2MB)</small>
                <input 
                  type="file" 
                  id="supportLetterUpload" 
                  style={{display: 'none'}} 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg" 
                  onChange={(e) => handleFileChange('supportLetter', e)}
                />
                <div className="file-preview" id="supportLetterPreview"></div>
              </div>
            </div>
          </div>
          
          <div style={{margin: '30px 0', textAlign: 'center'}}>
            <label>
              <input type="checkbox" id="confirmCheckbox" defaultChecked /> I confirm that all information provided is accurate
            </label>
          </div>
          
          {error && <div className="error-message" style={{textAlign: 'center', marginBottom: '15px'}}>{error}</div>}
          
          <div style={{textAlign: 'center'}}>
            <button 
              type="submit" 
              className="button btn-success" 
              style={{fontSize: '16px', padding: '12px 40px'}} 
              disabled={loading || applicationsThisMonth >= 2}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type="button" className="button" style={{background: '#95a5a6', color: 'white'}} onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;