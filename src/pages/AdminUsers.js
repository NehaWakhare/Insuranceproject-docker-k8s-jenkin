// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AdminUsers.css'; 

// export default function AdminUsers() {
//   const [userPolicies, setUserPolicies] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8089/api/policy/all')
//       .then(response => {
//         setUserPolicies(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching user policies:', error);
//         alert("Failed to fetch user data.");
//       });
//   }, []);

//   return (
//     <div className="admin-users-container">
//       <h2>Users and Their Policies</h2>
//       <table className="users-table">
//         <thead>
//           <tr>
//             <th>User ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Policy Name</th>
//             <th>Status</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {userPolicies.length === 0 ? (
//             <tr><td colSpan="7">No user policies found.</td></tr>
//           ) : (
//             userPolicies.map((user, index) => (
//               <tr key={index}>
//                 <td>{user.userId}</td>
//                 <td>{user.userName}</td>
//                 <td>{user.email}</td>
//                 <td>{user.policyName}</td>
//                 <td>{user.status}</td>
//                 <td>{user.startDate}</td>
//                 <td>{user.endDate}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
