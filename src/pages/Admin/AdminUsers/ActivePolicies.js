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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import CONFIG from "../../../config/config";

export default function ActivePolicies() {
  const adminId = sessionStorage.getItem("adminId");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState({ id: "", nominee: "", relation: "" });

  const BASE_URL = CONFIG.BASE_URL;

  // ✅ Fetch all active policies for this admin
  const fetchActivePolicies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/admin/active-policies/${adminId}`
      );

      if (Array.isArray(res.data)) {
        setPolicies(res.data);
      } else if (res.data && res.data.policies) {
        setPolicies(res.data.policies);
      } else {
        setPolicies([]);
      }
    } catch (err) {
      console.error("Failed to fetch active policies:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch active policies",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePolicies();
  }, []);

  // ✅ Open edit dialog for nominee & relation
  const handleEdit = (policy) => {
    setEditData({
      id: policy.id,
      nominee: policy.nominee || "",
      relation: policy.nomineeRelation || "",
    });
    setEditDialog(true);
  };

  // ✅ Update nominee and relation
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${BASE_URL}/user-policy/update/${editData.id}`, {
        nominee: editData.nominee,
        nomineeRelation: editData.relation,
      });

      setPolicies((prev) =>
        prev.map((p) =>
          p.id === editData.id
            ? { ...p, nominee: editData.nominee, nomineeRelation: editData.relation }
            : p
        )
      );

      setSnackbar({
        open: true,
        message: "Nominee details updated successfully",
        severity: "success",
      });
      setEditDialog(false);
    } catch (err) {
      console.error("Error updating nominee:", err);
      setSnackbar({
        open: true,
        message: "Error updating nominee details",
        severity: "error",
      });
    }
  };

  // ✅ Delete policy
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await axios.delete(`${BASE_URL}/user-policy/delete/${id}`);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({
        open: true,
        message: "Policy deleted successfully",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting policy:", err);
      setSnackbar({
        open: true,
        message: "Error deleting policy",
        severity: "error",
      });
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", m: "auto", mt: 3 }} />;

  return (
    <div style={{ padding: "20px" }}>
      <h3>Active User Policies</h3>

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
                ❌ No active policies found.
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
                    onClick={() => handleEdit(p)}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(p.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ✅ Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Nominee Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Nominee"
            fullWidth
            margin="normal"
            value={editData.nominee}
            onChange={(e) =>
              setEditData({ ...editData, nominee: e.target.value })
            }
          />
          <TextField
            label="Relation"
            fullWidth
            margin="normal"
            value={editData.relation}
            onChange={(e) =>
              setEditData({ ...editData, relation: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar Notifications */}
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
