// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ProfileInfo.css";

// const ProfileInfo = () => {
//   const [formData, setFormData] = useState({
//     id: "",
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//     dob: "",
//     gender: "",
//     maritalStatus: "",
//     occupation: "",
//     nomineeName: "",
//     nomineeRelation: "",
//     bloodGroup: "",
//     emergencyContact: "",
//     policy: "",
//     policyType: "",
//     aadhaarNumber: "",
//   });

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [profileExists, setProfileExists] = useState(false);
//   const userId = sessionStorage.getItem("userId");

//   // Get token
//   const getAuthToken = () => {
//     const authData = JSON.parse(localStorage.getItem("authData"));
//     return authData?.token || null;
//   };

//   // Fetch profile
//   const fetchUserProfile = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         console.error("No token found!");
//         return;
//       }

//       const res = await axios.get(
//         `http://localhost:8089/api/user-profiles/by-user/${userId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data) {
//         setFormData(res.data);
//         setProfileExists(true);
//         setIsEditMode(false);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchUserProfile();
    
//   }, [userId]);

  
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Save or update
//   const handleSave = async () => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         console.error("No token found!");
//         return;
//       }

//       if (profileExists) {
//         await axios.put(
//           `http://localhost:8089/api/user-profiles/${formData.id}`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert("Profile updated successfully!");
//       } else {
//         await axios.post(
//           `http://localhost:8089/api/user-profiles/save/${userId}`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         alert("Profile created successfully!");
//       }

//       fetchUserProfile();
//       setIsEditMode(false);
//     } catch (err) {
//       console.error("Error saving profile:", err);
//     }
//   };

//   // Label formatter
//   const formatLabel = (key) =>
//     key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

//   // Input type matcher
//   const getInputType = (key) => {
//     if (key === "dob") return "date";
//     if (key === "email") return "email";
//     if (key === "password") return "password";
//     if (key === "phone" || key === "emergencyContact") return "tel";
//     return "text";
//   };

//   return (
//     <div className="profile-container">
//       <h2>{isEditMode ? "Complete/Edit Your Profile" : "Your Profile"}</h2>

//       {isEditMode ? (
//         <form className="profile-form">
//           <div className="form-grid">
//             {Object.entries(formData).map(([key, value]) =>
//               key === "id" ? null : (
//                 <div className="form-group" key={key}>
//                   <label>{formatLabel(key)}</label>
//                   <input
//                     type={getInputType(key)}
//                     name={key}
//                     value={value || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               )
//             )}
//           </div>
//           <button
//             type="button"
//             className="submit-btn"
//             onClick={handleSave}
//           >
//             Save Profile
//           </button>
//         </form>
//       ) : (
//         <div className="profile-view">
//           <table>
//             <tbody>
//               {Object.entries(formData).map(([key, value]) =>
//                 key === "id" ? null : (
//                   <tr key={key}>
//                     <td className="profile-label">{formatLabel(key)}</td>
//                     <td>{value}</td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//           <button
//             className="submit-btn"
//             onClick={() => setIsEditMode(true)}
//           >
//             Edit Profile
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileInfo;
