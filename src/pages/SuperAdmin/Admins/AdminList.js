
import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../../../api/superAdminApi";
import CONFIG from "../../../config/config"; 
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${CONFIG.BASE_URL}/api/admin/all`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to fetch admins: ${res.status}`);
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".username-clickable")
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (adminId) => {
    setOpenMenu(openMenu === adminId ? null : adminId);
  };

  const handleOpenPopup = async (admin, type) => {
    setPopupType(type);
    setSelectedAdmin(admin);
    setPopupLoading(true);
    setOpenPopup(true);
    setOpenMenu(null);

    try {
      const url =
        type === "profile"
          ? `${CONFIG.BASE_URL}/api/admin/${admin.id}`
          : `${CONFIG.BASE_URL}/admin/${admin.id}/policy-plans`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch ${type}: ${res.status}`);
      const data = await res.json();
      setPopupData(data);
    } catch (err) {
      console.error("Popup fetch error:", err);
      setPopupData({ error: err.message });
    } finally {
      setPopupLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/admin/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Failed to delete admin: ${res.status}`);

      setSnackbar({
        open: true,
        message: "Admin deleted successfully!",
        severity: "success",
      });
      fetchAdmins();
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({
        open: true,
        message: "Error deleting admin.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) return <p>Loading admins...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.wrapper}>
      {openPopup && <div style={styles.blurOverlay}></div>}

      <div style={styles.container}>
        <h2 style={styles.title}> Admin List</h2>

        {admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>PAN Number</th>
                  <th style={styles.th}>Mobile Number</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} style={styles.tr}>
                    <td style={styles.td}>{admin.id}</td>
                    <td style={{ ...styles.td, position: "relative" }}>
                      <span
                        className="username-clickable"
                        style={styles.clickable}
                        onClick={() => handleMenuToggle(admin.id)}
                      >
                        {admin.username || "—"} ⬇️
                      </span>
                      {openMenu === admin.id && (
                        <div className="dropdown-menu" style={styles.dropdown}>
                          <p
                            style={styles.dropdownItem}
                            onClick={() => handleOpenPopup(admin, "profile")}
                          >
                            Admin Profile
                          </p>
                          <p
                            style={styles.dropdownItem}
                            onClick={() => handleOpenPopup(admin, "policies")}
                          >
                            Uploaded Policies
                          </p>
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>{admin.email}</td>
                    <td style={styles.td}>{admin.panNumber || "N/A"}</td>
                    <td style={styles.td}>{admin.mobileNumber || "N/A"}</td>
                    <td style={styles.td}>{admin.role}</td>
                    <td style={styles.actionCell}>
                      {admin.role !== "SUPER_ADMIN" && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteAdmin(admin.id)}
                          style={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "500",
                            fontSize: "0.8rem",
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: "15px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            position: "relative",
          },
        }}
      >
        <DialogTitle
          style={{
            background: "#2563eb",
            color: "#fff",
            fontWeight: "600",
            textAlign: "center",
            padding: "16px 24px",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          {popupType === "profile"
            ? `👤 ${selectedAdmin?.username || "Admin"}'s Profile`
            : `📄 ${selectedAdmin?.username || "Admin"}'s Uploaded Policies`}
          <IconButton
            onClick={() => setOpenPopup(false)}
            sx={{ position: "absolute", right: 12, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ backgroundColor: "#f9fafb", padding: "25px 30px" }}>
          {popupLoading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <CircularProgress />
              <p style={{ marginTop: "10px", color: "#666" }}>Loading...</p>
            </div>
          ) : popupData?.error ? (
            <p style={{ color: "red", textAlign: "center" }}>{popupData.error}</p>
          ) : popupType === "profile" ? (
            <div style={styles.popupCard}>
              <h3 style={styles.popupTitle}>Admin Information</h3>
              <div style={styles.popupGrid}>
                <p><b>ID:</b> {popupData.id}</p>
                <p><b>Username:</b> {popupData.username || "N/A"}</p>
                <p><b>Email:</b> {popupData.email}</p>
                <p><b>Role:</b> {popupData.role}</p>
                <p><b>PAN No:</b> {popupData.panNumber || "N/A"}</p>
                <p><b>Mobile:</b> {popupData.mobileNumber || "N/A"}</p>
              </div>
            </div>
          ) : (
            <div>
              {popupData?.length > 0 ? (
                <div style={styles.policyGrid}>
                  {popupData.map((policy) => (
                    <div key={policy.id} style={styles.policyCard}>
                      <h4 style={styles.policyTitle}>{policy.policyName}</h4>
                      <p><b>Type:</b> {policy.policyType}</p>
                      <p><b>Premium:</b> ₹{policy.premium}</p>
                      <p><b>Duration:</b> {policy.duration || "N/A"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#555" }}>
                  No uploaded policies found.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}



//  Styles
const styles = {
  wrapper: {
    position: "relative",
  },
  blurOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(6px)",
    zIndex: 5,
  },
  container: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 1,
  },
  title: {
    marginBottom: "20px",
    fontWeight: "600",
    color: "#1e3a8a",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },
  th: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    textAlign: "left",
    fontSize: "0.9rem",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
    fontSize: "0.9rem",
    color: "#333",
  },
  tr: {
    transition: "background 0.2s",
  },
  clickable: {
    color: "#2563eb",
    fontWeight: "500",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "120%",
    left: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 10,
    minWidth: "160px",
  },
  dropdownItem: {
    padding: "10px 15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  actionCell: {
    padding: "12px",
    textAlign: "center",
  },
  popupCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: "25px 30px",
    lineHeight: "1.8",
  },
  popupTitle: {
    color: "#1e3a8a",
    marginBottom: "15px",
    fontSize: "1.2rem",
    textAlign: "center",
  },
  popupGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px 24px",
    fontSize: "0.95rem",
  },
  policyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  policyCard: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: "20px",
    borderLeft: "5px solid #2563eb",
  },
  policyTitle: {
    color: "#1e3a8a",
    marginBottom: "8px",
    fontSize: "1.05rem",
    fontWeight: "600",
  },
};
