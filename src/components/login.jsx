import { useState } from "react";
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login, register } from "../api/auth";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleToggle = () => setShowPassword((prev) => !prev);

  const [errors, setErrors] = useState({});
  const { setAuthUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setErrors({});
    setFormData({ username: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "username" && tab === 1 && !value.trim()) {
      error = "Username is required";
    }

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
        error = "Invalid email address";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (tab === 1 && value.length < 6)
        error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (tab === 1 && !formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (tab === 1 && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (tab === 0) {
        const data = await login({
          email: formData.email,
          password: formData.password,
        });
        setAuthUser(data);
        {
          isAdmin(data) ? navigate("/admin") : navigate("/");
        }
      } else {
        const data = await register(formData);
        console.log("Register success:", data);
        {
          isAdmin(data) ? navigate("/admin") : navigate("/");
        }
      }
    } catch (error) {
      const apiErrors = {};
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else {
        console.error("API error:", error.response?.data || error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
      <Paper sx={{ width: 380, padding: 4, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" align="center" mb={2}>
          {tab === 0 ? "Login" : "Register"}
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4"
        >
          {tab === 1 && (
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
            />
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggle} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px" }}
            fullWidth
          >
            {tab === 0 ? "Login" : "Register"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
