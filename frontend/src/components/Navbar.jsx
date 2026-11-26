import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { authenticated, email, role, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link className="nav-brand" to="/products">
                    Shop
                </Link>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/cart">Cart</NavLink>
                {role === "ADMIN" && (
                    <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                )}
            </div>

            <div className="nav-user">
                {authenticated ? (
                    <>
                        {email && <span className="nav-user-email">{email}</span>}
                        <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}
