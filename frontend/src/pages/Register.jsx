const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.password) {
    alert("Please fill all fields");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  console.log("Register Data:", formData);

  localStorage.setItem("token", "demo-token");

  alert("Registration Successful!");

  navigate("/dashboard");
};