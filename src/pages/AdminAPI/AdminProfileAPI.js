import axios from "axios";
import CONFIG from "../../config/config";

const API_BASE_URL = `${CONFIG.BASE_URL}/api/admin-profiles`;

// ✅ Create Admin Profile (by admin ID)
export const saveAdminProfile = async (adminId, data) => {
  if (!adminId) throw new Error("Admin ID missing!");

  const res = await axios.post(`${API_BASE_URL}/save/${adminId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Update Admin Profile
export const updateAdminProfile = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// ✅ Get Profile by Admin ID
export const getAdminProfileByAdminId = async (adminId) => {
  const res = await axios.get(`${API_BASE_URL}/by-admin/${adminId}`);
  return res.data;
};