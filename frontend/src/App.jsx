import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import Applicants from "./pages/Applicants";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

    <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Jobs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/employer"
          element={
            <ProtectedRoute
              allowedRole="employer"
            >
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate"
          element={
            <ProtectedRoute
              allowedRole="candidate"
            >
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/job/:id/applicants" 
          element={<Applicants />} 
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;