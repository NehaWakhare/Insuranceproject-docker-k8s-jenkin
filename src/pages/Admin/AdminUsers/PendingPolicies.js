import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import CONFIG from "../../../config/config";

export default function PendingPolicies() {
  const adminId = sessionStorage.getItem("adminId");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const BASE_URL = CONFIG.BASE_URL;

  // ✅ Fetch all pending policies for this admin
  const fetchPendingPolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/admin/pending-policies/${adminId}`
      );

      if (Array.isArray(res.data)) {
        setPolicies(res.data);
      } else if (res.data && res.data.policies) {
        setPolicies(res.data.policies);
      } else {
        setPolicies([]);
      }
    } catch (err) {
      console.error("Failed to fetch pending policies:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch pending policies",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPolicies();
  }, []);

  // ✅ Update policy status (Active / Rejected)
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/user-policy/update/${id}`, {
        policyStatus: status,
      });

      setPolicies((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, policyStatus: status } : p
        )
      );

      setSnackbar({
        open: true,
        message: `Policy marked as ${status}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error updating policy:", err);
      setSnackbar({
        open: true,
        message: "Error updating policy",
        severity: "error",
      });
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", m: "auto", mt: 3 }} />;

  return (
    <div style={{ padding: "20px" }}>
      <h3>Pending User Policies</h3>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr.No</TableCell>
            <TableCell>Policy Name</TableCell>
            <TableCell>Policy Type</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Nominee</TableCell>
            <TableCell>Relation</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {policies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                ❌ No pending policies found.
              </TableCell>
            </TableRow>
          ) : (
            policies.map((p, index) => (
              <TableRow key={p.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{p.policyPlan?.policyName || "N/A"}</TableCell>
                <TableCell>
                  {p.policyPlan?.policyType?.name ||
                    p.policyPlan?.policyType ||
                    "N/A"}
                </TableCell>
                <TableCell>{p.startDate || "N/A"}</TableCell>
                <TableCell>{p.endDate || "N/A"}</TableCell>
                <TableCell>{p.nominee || "N/A"}</TableCell>
                <TableCell>{p.nomineeRelation || "N/A"}</TableCell>
                <TableCell>{p.policyStatus}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleStatusChange(p.id, "ACTIVE")}
                    color="primary"
                    disabled={p.policyStatus === "ACTIVE"}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(p.id, "REJECTED")}
                    color="error"
                    disabled={p.policyStatus === "REJECTED"}
                    sx={{ ml: 1 }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}
