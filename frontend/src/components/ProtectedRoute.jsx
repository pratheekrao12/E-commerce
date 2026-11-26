import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { authenticated, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="container">
                <div className="loading-state">Checking session...</div>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && role !== "ADMIN") {
        return <Navigate to="/products" replace />;
    }

    return children;
}
