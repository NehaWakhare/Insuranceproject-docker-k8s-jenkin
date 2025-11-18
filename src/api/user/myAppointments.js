import axios from "axios";
import CONFIG from "../../config/config";

const API = axios.create({
  baseURL: CONFIG.BASE_URL,
});

API.interceptors.request.use((config) => {
  const authData = JSON.parse(sessionStorage.getItem("authData"));
  const token = authData?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch appointments for a user profile
 * @param {number|string} userProfileId
 */
export const fetchMyAppointments = async (userProfileId) => {
  if (!userProfileId) throw new Error("User Profile ID is required");

  try {
    const response = await API.get(`/appointments/user/${userProfileId}`);
    return response.data;
  } catch (err) {
    console.error("Error in fetchMyAppointments:", err.response || err);
    throw err;
  }
};

/**
 * Book a new appointment
 * @param {Object} appointmentData
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await API.post("/appointments/book", appointmentData);
    return response.data;
  } catch (err) {
    console.error("Error booking appointment:", err.response || err);
    throw err;
  }
};
