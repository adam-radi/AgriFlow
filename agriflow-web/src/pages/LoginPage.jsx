import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";

import { loginUser } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
    selectUserRole,
} from "../features/auth/authSelectors";
import "../assets/auth.css";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const role = useSelector(selectUserRole);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    // Redirect based on role after login
    if (isAuthenticated) {
        const roleMap = {
            Admin: "/dashboard/admin",
            Farmer: "/dashboard/farmer",
            Client: "/dashboard/client",
            Livreur: "/dashboard/delivery",
        };
        return <Navigate to={roleMap[role] || "/dashboard"} replace />;
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">🌿</div>
                        <div className="auth-logo-text">Agri<span>Flow</span></div>
                    </div>
                    <p className="auth-subtitle">Fresh from farm to your table</p>
                </div>

                {/* Body */}
                <div className="auth-body">
                    <div className="auth-section-title">
                        <span>🔑</span> Sign in to your account
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="login-email">Email Address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">✉️</span>
                                <input
                                    id="login-email"
                                    className="auth-input"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="login-password">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    id="login-password"
                                    className="auth-input"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="login-submit-btn"
                            className="auth-btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="auth-spinner" />
                                    Signing in...
                                </>
                            ) : (
                                <>🚀 Sign In</>
                            )}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="auth-footer-links">
                        <p className="mb-1">
                            Don't have an account?
                        </p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <Link to="/register/client" className="auth-link">
                                🛒 Join as Client
                            </Link>
                            <span className="text-muted">·</span>
                            <Link to="/register/farmer" className="auth-link">
                                🌾 Join as Farmer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
