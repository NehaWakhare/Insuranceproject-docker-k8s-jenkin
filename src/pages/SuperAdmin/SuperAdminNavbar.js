import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Fade,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SuperAdminNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const userName = "Super Admin";

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/superadmin/dashboard/profile");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/superadmin/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#333",
        borderBottom: "1px solid #e0e0e0",
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Left side - Logo / Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#1a237e", letterSpacing: "0.5px" }}
        >
          Super Admin Dashboard
        </Typography>

        {/* Right side - Profile dropdown */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleMenu}
            sx={{
              p: 0.5,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              transition: "0.3s ease",
            }}
          >
            <Avatar
              alt={userName}
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #1a237e",
                cursor: "pointer",
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.2,
                borderRadius: "12px",
                minWidth: 180,
                boxShadow:
                  "0 4px 10px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              },
            }}
          >
            <MenuItem
              disabled
              sx={{
                fontWeight: "bold",
                color: "#1a237e",
                opacity: 0.9,
                fontSize: "0.95rem",
              }}
            >
              {userName}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleProfile}
              sx={{
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                  color: "#1a237e",
                },
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "red",
                "&:hover": {
                  backgroundColor: "#ffebee",
                  color: "#d32f2f",
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
