import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-toggle">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
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