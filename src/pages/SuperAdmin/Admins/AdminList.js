import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // track which username menu is open
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8089/api/admin/all");
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleMenuToggle = (adminId) => {
    setOpenMenu(openMenu === adminId ? null : adminId);
  };

  const handleNavigation = (adminId, type) => {
    if (type === "profile") {
      navigate(`/superadmin/dashboard/admins/${adminId}/profile`);
    } else if (type === "policies") {
      navigate(`/superadmin/dashboard/admins/${adminId}/policies`);
    }
    setOpenMenu(null); // close menu after navigation
  };
  if (loading) return <p>Loading admins...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Admin List</h2>
      {admins.length === 0 ? (
        <p>No admins found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>GST No</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td style={{ position: "relative" }}>
                  <span
                    style={styles.clickable}
                    onClick={() => handleMenuToggle(admin.id)}
                  >
                    {admin.username}
                  </span>
                  {openMenu === admin.id && (
                    <div style={styles.dropdown}>
                      <p
                        style={styles.dropdownItem}
                        onClick={() => handleNavigation(admin.id, "profile")}
                      >
                        Admin Profile
                      </p>
                      <p
                        style={styles.dropdownItem}
                        onClick={() => handleNavigation(admin.id, "policies")}
                      >
                        Uploaded Policies
                      </p>
                    </div>
                  )}
                </td>
                <td>{admin.email}</td>
                <td>{admin.gstNumber}</td>
                <td>{admin.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
           
const styles = {
  container: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  clickable: {
    color: "#2563eb",
    fontWeight: "500",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    zIndex: 10,
    marginTop: "5px",
  },
  dropdownItem: {
    padding: "8px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
  