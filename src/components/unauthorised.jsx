import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h2" color="error" fontWeight={700}>
        403
      </Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Access Denied
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, maxWidth: 400 }}>
        You do not have permission to view this page. Please contact admin if
        you believe this is a mistake.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px" }}
      >
        Login
      </Button>
    </Box>
  );
};

export default NotAuthorized;
