import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function RouteProtegee({ children: enfants }) {
    const token = localStorage.getItem("token");
    return token ? enfants : <Navigate to="/login" replace />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <RouteProtegee>
                            <Dashboard />
                        </RouteProtegee>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
