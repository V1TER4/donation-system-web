// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Donate from "./pages/Donate";
import History from "./pages/History";
import Favorites from "./pages/Favorite";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="container mt-4">
            <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/history" element={<History />} />
            <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
