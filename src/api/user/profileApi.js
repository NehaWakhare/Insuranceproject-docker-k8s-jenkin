import axios from "axios";
import CONFIG from "../../config/config";

const BASE_URL = `${CONFIG.BASE_URL}/api/user-profiles`;

export const fetchUserProfileApi = async (userId, token) => {
  const res = await axios.get(`${BASE_URL}/by-user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const saveUserProfileApi = async (userId, data, token) => {
  const res = await axios.post(`${BASE_URL}/save/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUserProfileApi = async (id, data, token) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
