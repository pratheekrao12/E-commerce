import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const registered = Boolean(location.state?.registered);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const authState = await login(email, password);
            navigate(authState.role === "ADMIN" ? "/admin/dashboard" : "/products", {
                replace: true,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="container">
            <div className="form-card">
                <h2>Welcome back</h2>
                <p className="form-subtitle">Sign in to your account to continue shopping.</p>

                {registered && (
                    <div className="alert-success">Account created. Please log in.</div>
                )}

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-full" disabled={submitting}>
                        {submitting ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="form-footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}
