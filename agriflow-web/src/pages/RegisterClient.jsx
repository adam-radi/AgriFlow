import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerClient } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
} from "../features/auth/authSelectors";
import "../assets/auth.css";

export default function RegisterClientPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setLocalError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setLocalError("Passwords do not match.");
            return;
        }
        dispatch(registerClient(formData)).unwrap()
            .then(() => navigate("/dashboard/client"))
            .catch(() => {});
    };

    const displayError = localError || error;

    return (
        <div className="auth-page">
            <div className="auth-card auth-card-wide">

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
                        <span>🛒</span> Create a Client Account
                    </div>

                    {displayError && (
                        <div className="auth-alert auth-alert-error">
                            <span>⚠️</span>
                            <span>{displayError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Full Name */}
                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="client-name">Full Name</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">👤</span>
                                <input
                                    id="client-name"
                                    className="auth-input"
                                    type="text"
                                    name="name"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="client-email">Email Address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">✉️</span>
                                <input
                                    id="client-email"
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
                            <label className="auth-label" htmlFor="client-password">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    id="client-password"
                                    className="auth-input"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <button type="button" className="auth-input-toggle" onClick={() => setShowPassword(v => !v)}>
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="auth-form-group">
                            <label className="auth-label" htmlFor="client-password-confirm">Confirm Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔐</span>
                                <input
                                    id="client-password-confirm"
                                    className={`auth-input ${localError ? "is-invalid" : ""}`}
                                    type={showConfirm ? "text" : "password"}
                                    name="password_confirmation"
                                    placeholder="Repeat your password"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: "2.5rem" }}
                                />
                                <button type="button" className="auth-input-toggle" onClick={() => setShowConfirm(v => !v)}>
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="register-client-submit-btn"
                            className="auth-btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="auth-spinner" />
                                    Creating account...
                                </>
                            ) : (
                                <>🛒 Create Client Account</>
                            )}
                        </button>
                    </form>

                    {/* Links */}
                    <div className="auth-footer-links">
                        <p className="mb-1">
                            Already have an account?{" "}
                            <Link to="/login" className="auth-link">Sign in</Link>
                        </p>
                        <p className="mb-0">
                            Want to sell? {" "}
                            <Link to="/register/farmer" className="auth-link">🌾 Register as Farmer</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
