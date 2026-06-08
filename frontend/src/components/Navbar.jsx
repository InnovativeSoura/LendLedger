import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { user, logout } =
    useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between">

      <h1 className="font-bold text-xl">
        LendLedger
      </h1>

      <div className="flex gap-4">

        <Link to="/">
          Dashboard
        </Link>

        {user && (
          <>
            <span>
              {user.name}
            </span>

            <button
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;