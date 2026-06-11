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

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      if (!formData.phone) {
        alert("Please enter phone number");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        {
          phone: formData.phone,
        }
      );

      setOtpSent(true);

      alert(
        "OTP sent successfully. Check backend terminal or Render logs."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          phone: formData.phone,
          otp,
        }
      );

      if (response.data.success) {
        setPhoneVerified(true);

        alert("Phone verified successfully");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const upiRegex =
      /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.upiId
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!upiRegex.test(formData.upiId)) {
      alert(
        "Please enter a valid UPI ID (e.g. soura@paytm)"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    if (!phoneVerified) {
      alert(
        "Please verify your phone number first"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          upiId: formData.upiId,
          password: formData.password,
        }
      );

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      alert("Registration Successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Registration failed"
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
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>

          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}

          {phoneVerified && (
            <p
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              ✓ Phone Verified
            </p>
          )}

          <input
            type="text"
            name="upiId"
            placeholder="UPI ID (e.g. soura@paytm)"
            value={formData.upiId}
            onChange={handleChange}
            pattern="^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$"
            title="Enter a valid UPI ID"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
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
            textAlign: "center",
            marginTop: "15px",
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