import axios from "axios";
import CONFIG from "../../config/config"; 

const API_URL = `${CONFIG.BASE_URL}/admin`;



// ✅ CREATE Policy
export const createPolicyPlan = async (adminId, formData) => {
  return await axios.post(`${API_URL}/${adminId}/policy-plans`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ GET Policies
export const getPlansByAdmin = async (adminId) => {
  return await axios.get(`${API_URL}/${adminId}/policy-plans`);
};

// ✅ UPDATE Policy
export const updatePolicyPlan = async (adminId, planId, formData) => {
  return await axios.put(`${API_URL}/${adminId}/policy-plans/${planId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ DELETE Policy
export const deletePolicyPlan = async (adminId, planId) => {
  return await axios.delete(`${API_URL}/${adminId}/policy-plans/${planId}`);
};
