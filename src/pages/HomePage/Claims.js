// import React, { useState } from 'react';
// import axios from 'axios';
// import './Claims.css';

// const Claims = () => {
//   const [claim, setClaim] = useState({
//     claimType: '',
//     incidentDate: '',
//     amount: '',
//   });

//   const [files, setFiles] = useState([]);
//   const [documentTypes, setDocumentTypes] = useState([]);
//   const [claimId, setClaimId] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);

//   const userId = JSON.parse(localStorage.getItem('authData'))?.userId;

//   const handleClaimChange = (e) => {
//     const { name, value } = e.target;
//     setClaim((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleClaimSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const claimData = {
//         ...claim,
//         user: { userId: parseInt(userId) },
//       };

//       const res = await axios.post('http://localhost:8089/api/claims/add', claimData);
//       setClaimId(res.data.claimId);
//       setShowUpload(true);
//       alert('Claim submitted successfully!');
//     } catch (err) {
//       console.error('Claim submission error:', err.response || err);
//       alert('Failed to submit claim');
//     }
//   };

//   // When files are selected
//   const handleFilesChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//     setDocumentTypes(selectedFiles.map(() => '')); // initialize types
//   };

//   const handleDocumentTypeChange = (index, value) => {
//     const newTypes = [...documentTypes];
//     newTypes[index] = value;
//     setDocumentTypes(newTypes);
//   };

//   // Upload multiple documents
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!files.length || !claimId) return;

//     const formData = new FormData();
//     files.forEach((file) => formData.append('file', file));
//     documentTypes.forEach((type) => formData.append('documentType', type));

//     try {
//       await axios.post(
//         `http://localhost:8089/api/claims/${claimId}/documents/multiple`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       alert('Documents uploaded successfully!');
//       setFiles([]);
//       setDocumentTypes([]);
//       setShowUpload(false);
//     } catch (err) {
//       console.error('Document upload error:', err.response || err);
//       alert('Failed to upload documents');
//     }
//   };

//   return (
//     <div className="claims-container">
//       <h2>Submit a Claim</h2>
//       <form onSubmit={handleClaimSubmit}>
//         <input
//           type="text"
//           name="claimType"
//           placeholder="Claim Type"
//           value={claim.claimType}
//           onChange={handleClaimChange}
//           required
//         />
//         <input
//           type="date"
//           name="incidentDate"
//           value={claim.incidentDate}
//           onChange={handleClaimChange}
//           required
//         />
//         <input
//           type="number"
//           name="amount"
//           placeholder="Amount"
//           value={claim.amount}
//           onChange={handleClaimChange}
//           required
//         />
//         <button type="submit">Submit Claim</button>
//       </form>

//       {showUpload && (
//         <div className="upload-section">
//           <h3>Upload Claim Documents</h3>
//           <form onSubmit={handleUpload}>
//             <input
//               type="file"
//               multiple
//               onChange={handleFilesChange}
//               required
//             />

//             {files.length > 0 && (
//               <div className="file-list">
//                 {files.map((file, index) => (
//                   <div key={index} className="file-entry">
//                     <span>{file.name}</span>
//                     <input
//                       type="text"
//                       placeholder="Document Type"
//                       value={documentTypes[index]}
//                       onChange={(e) => handleDocumentTypeChange(index, e.target.value)}
//                       required
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             <button type="submit">Upload Documents</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Claims;

