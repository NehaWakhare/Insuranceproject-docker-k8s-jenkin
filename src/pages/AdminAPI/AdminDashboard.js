import axios from "axios";

import CONFIG from "../../config/config";
const BASE_URL = CONFIG.BASE_URL;

export const getDashboardStats = async () => {
  const users = await axios.get(`${BASE_URL}/api/v1`);
  const policies = await axios.get(`${BASE_URL}/user/fetch-plan`);
  const claims = await axios.get(`${BASE_URL}/claims`);

  const totalPolicies = policies.data.length;
  const activeUsers = users.data.filter(u => u.role === "USER").length;
  const pendingClaims = claims.data.filter(c => c.status === "PENDING").length;
  const approvedClaims = claims.data.filter(c => c.status === "APPROVED").length;

  return { totalPolicies, activeUsers, pendingClaims, approvedClaims };
};
