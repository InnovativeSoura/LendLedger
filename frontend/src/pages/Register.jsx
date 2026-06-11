import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    upiId: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const registerUrl = `${import.meta.env.VITE_API_URL}/auth/register`;

      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Register URL:", registerUrl);

      const response = await axios.post(registerUrl, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        upiId: formData.upiId,
        password: formData.password,
      });

      console.log("Registration Success:", response.data);

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      alert("Registration Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration Error:", error);

      console.log(
        "Server Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="upiId"
            placeholder="UPI ID (e.g. name@paytm)"
            value={formData.upiId}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>
        </form>

        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;