// // src/api/User/myDocumentsApi.js
// import axios from 'axios';

// const BASE_URL = 'http://localhost:8089/api/documents';

// // ----------- API with token -----------
// export const getDocumentsWithToken = (token) => {
//   return axios.get(BASE_URL, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };

// // ----------- API without token -----------
// export const uploadDocument = (file, userId, documentName) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('userId', userId);
//   formData.append('documentName', documentName);

//   return axios.post(`${BASE_URL}/upload`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
// };

// export const viewDocument = (documentId) => {
//   return axios.get(`${BASE_URL}/view/${documentId}`, {
//     responseType: 'blob'
//   });
// };

// export const downloadDocument = (documentId) => {
//   return axios.get(`${BASE_URL}/download/${documentId}`, {
//     responseType: 'blob'
//   });
// };
