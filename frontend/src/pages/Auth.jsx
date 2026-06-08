import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>LendLedger</h1>

        <div className="toggle-buttons">
          <button
            onClick={() => setIsLogin(true)}
            className={isLogin ? "active" : ""}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? "active" : ""}
          >
            Register
          </button>
        </div>

        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default Auth;