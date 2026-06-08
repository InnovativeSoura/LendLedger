import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>LendLedger</h1>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="welcome-card">
        <h2>Welcome to LendLedger</h2>
        <p>
          Manage lending, borrowing, UPI payments, and account statements in
          one place.
        </p>
      </div>

      <div className="stats-container">
        <div className="stat-card lend">
          <h3>Total Lent</h3>
          <p>₹0</p>
        </div>

        <div className="stat-card borrow">
          <h3>Total Borrowed</h3>
          <p>₹0</p>
        </div>

        <div className="stat-card balance">
          <h3>Net Balance</h3>
          <p>₹0</p>
        </div>
      </div>

      <div className="action-grid">
        <button onClick={() => navigate("/transactions")}>
          Add Transaction
        </button>

        <button onClick={() => navigate("/statement")}>
          View Statement
        </button>

        <button onClick={() => navigate("/upi")}>
          UPI Payments
        </button>

        <button onClick={() => navigate("/contacts")}>
          Manage Contacts
        </button>
      </div>
    </div>
  );
}

export default Dashboard;