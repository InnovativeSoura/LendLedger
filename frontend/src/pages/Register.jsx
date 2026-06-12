import React, { useState } from "react";
import axios from "axios";

function Register() {
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
const [emailVerified, setEmailVerified] =
useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]:
e.target.value,
});
};

const sendOtp = async () => {
try {
await axios.post(
`${import.meta.env.VITE_API_URL}/auth/send-otp`,
{
email:
formData.email,
}
);


  setOtpSent(true);

  alert(
    "OTP sent to your email"
  );
} catch (error) {
  alert(
    error.response?.data
      ?.message ||
      "Failed to send OTP"
  );
}


};

const verifyOtp = async () => {
try {
const response =
await axios.post(
`${import.meta.env.VITE_API_URL}/auth/verify-otp`,
{
email:
formData.email,
otp,
}
);


  if (
    response.data.success
  ) {
    setEmailVerified(
      true
    );

    alert(
      "Email verified successfully"
    );
  }
} catch (error) {
  alert(
    error.response?.data
      ?.message ||
      "OTP verification failed"
  );
}


};

const handleSubmit =
async (e) => {
e.preventDefault();


  if (
    !emailVerified
  ) {
    return alert(
      "Verify email first"
    );
  }

  if (
    formData.password !==
    formData.confirmPassword
  ) {
    return alert(
      "Passwords do not match"
    );
  }

  try {
    const response =
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name: formData.name,
          email:
            formData.email,
          phone:
            formData.phone,
          upiId:
            formData.upiId,
          password:
            formData.password,
        }
      );

    localStorage.setItem(
      "token",
      response.data.token
    );

    alert(
      "Registration Successful"
    );

    window.location.reload();
  } catch (error) {
    alert(
      error.response?.data
        ?.message ||
        "Registration failed"
    );
  }
};


return (
<form
onSubmit={
handleSubmit
}
>
<input
type="text"
name="name"
placeholder="Full Name"
value={
formData.name
}
onChange={
handleChange
}
required
/>


  <input
    type="email"
    name="email"
    placeholder="Email"
    value={
      formData.email
    }
    onChange={
      handleChange
    }
    required
  />

  <button
    type="button"
    onClick={sendOtp}
  >
    Send OTP
  </button>

  {otpSent && (
    <>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value
          )
        }
      />

      <button
        type="button"
        onClick={
          verifyOtp
        }
      >
        Verify OTP
      </button>
    </>
  )}

  {emailVerified && (
    <p>
      ✅ Email Verified
    </p>
  )}

  <input
    type="tel"
    name="phone"
    placeholder="Phone Number"
    value={
      formData.phone
    }
    onChange={
      handleChange
    }
    required
  />

  <input
    type="text"
    name="upiId"
    placeholder="UPI ID"
    value={
      formData.upiId
    }
    onChange={
      handleChange
    }
    required
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={
      formData.password
    }
    onChange={
      handleChange
    }
    required
  />

  <input
    type="password"
    name="confirmPassword"
    placeholder="Confirm Password"
    value={
      formData.confirmPassword
    }
    onChange={
      handleChange
    }
    required
  />

  <button
    type="submit"
  >
    Register
  </button>
</form>


);
}

export default Register;
