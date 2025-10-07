import axios from "axios";
 
const API_BASE_URL = "http://localhost:8089/api/v1/admin";
 
// Create profile
export const saveAdminProfile = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/save`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
 
// Update profile
export const updateAdminProfile = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
 
// Get profile by profileId
export const getAdminProfile = async (profileId) => {
  const res = await axios.get(`${API_BASE_URL}/${profileId}`);
  return res.data;
};