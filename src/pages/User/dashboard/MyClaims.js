// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './MyClaims.css';

// const MyClaims = () => {
//   const [claims, setClaims] = useState([]);
//   const userId = JSON.parse(localStorage.getItem("authData"))?.userId;
//   const token = JSON.parse(localStorage.getItem("authData"))?.token;

//   useEffect(() => {
//     if (!userId || !token) {
//       alert("Please login to view your claims.");
//       return;
//     }

//     const fetchClaimsWithDocs = async () => {
//       try {
        
//         const claimsResponse = await axios.get(
//           `http://localhost:8089/api/claims/user/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const claimsData = claimsResponse.data;

        
//         const claimsWithDocs = await Promise.all(
//           claimsData.map(async (claim) => {
//             try {
//               const docResponse = await axios.get(
//                 `http://localhost:8089/api/claims/${claim.claimId}/documents`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               return { ...claim, documents: docResponse.data };
//             } catch (docErr) {
//               console.error(`Error fetching documents for claim ${claim.claimId}:`, docErr);
//               return { ...claim, documents: [] }; 
//             }
//           })
//         );

//         setClaims(claimsWithDocs);
//       } catch (error) {
//         console.error('Error fetching claims:', error);
//         alert('Failed to fetch claims');
//       }
//     };

//     fetchClaimsWithDocs();
//   }, [userId, token]);

//   return (
//     <div className="my-claims-container">
//       <h2>My Claims</h2>
//       {claims.length === 0 ? (
//         <p>No claims submitted yet.</p>
//       ) : (
//         claims.map((claim) => (
//           <div className="claim-card" key={claim.claimId}>
//             <h3>Claim Type: {claim.claimType}</h3>
//             <p><strong>Amount:</strong> ₹{claim.amount}</p>
//             <p><strong>Incident Date:</strong> {claim.incidentDate}</p>
//             <p><strong>Status:</strong> {claim.status}</p>
//             {claim.description && <p><strong>Description:</strong> {claim.description}</p>}

//             {claim.documents && claim.documents.length > 0 && (
//               <div className="documents-section">
//                 <h4>Uploaded Documents</h4>
//                 <ul>
//                   {claim.documents.map((doc) => (
//                     <li key={doc.claimDocumentId}>
//                       <strong>{doc.documentName}</strong> ({doc.documentType}) — {doc.uploadedDate} &nbsp;
//                       <a
//                         href={`http://localhost:8089/api/claims/documents/view/${doc.claimDocumentId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         View Document
//                       </a>
//                       &nbsp;|&nbsp;
//                       <a
//                         href={`http://localhost:8089/api/claims/documents/download/${doc.claimDocumentId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Download
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyClaims;
