import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import AdminList from "./AdminList";
import AdminApprovals from "./AdminApprovals";

export default function SuperAdminAdmins() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        ⚙️ Manage Admins
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="📋 Admin List" />
        <Tab label="✅ Admin Approvals" />
      </Tabs>

      {activeTab === 0 && <AdminList />}
      {activeTab === 1 && <AdminApprovals />}
    </Box>
  );
}
