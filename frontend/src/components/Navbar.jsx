import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const {
    token,
    role,
    logout
  } = useContext(AuthContext);

  return (

    <nav className="flex justify-between items-center p-4 border-b">

      <Link
        to="/"
        className="text-xl font-bold"
      >
        Job Board
      </Link>

      <div className="flex gap-4 items-center">

        {/* Public */}

        <Link to="/">
          Jobs
        </Link>

        {/* Not logged in */}

        {!token && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

        {/* Candidate */}

        {role === "candidate" && (

          <Link to="/candidate">
            Dashboard
          </Link>

        )}

        {/* Employer */}

        {role === "employer" && (

          <Link to="/employer">
            Dashboard
          </Link>

        )}

        {/* Logout */}

        {token && (

          <button
            onClick={logout}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  );
}

export default Navbar;