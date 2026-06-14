import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerFarmer } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
} from "../features/auth/authSelectors";
import "../assets/auth.css";

export default function RegisterFarmerPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localError, setLocalError] = useState("");
    const [registered, setRegistered] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

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
        dispatch(registerFarmer(formData)).unwrap()
            .then(() => {
                // Farmer needs approval - show success then redirect to login
                setRegistered(true);
                setTimeout(() => navigate("/login"), 3500);
            })
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

                    {registered ? (
                        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌾</div>
                            <div className="auth-alert auth-alert-success" style={{ textAlign: "left" }}>
                                <span>✅</span>
                                <span>
                                    <strong>Registration successful!</strong><br />
                                    Your farmer account is pending admin approval. You'll be able to access your dashboard once approved.
                                </span>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "var(--agri-muted)", marginTop: "0.5rem" }}>
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="auth-section-title">
                                <span>🌾</span> Create a Farmer Account
                            </div>

                            {/* Farmer info badge */}
                            <div className="auth-alert auth-alert-success" style={{ marginBottom: "1.25rem" }}>
                                <span>ℹ️</span>
                                <span style={{ fontSize: "0.82rem" }}>
                                    Farmer accounts require <strong>admin approval</strong> before access is granted.
                                </span>
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
                                    <label className="auth-label" htmlFor="farmer-name">Full Name</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">👤</span>
                                        <input
                                            id="farmer-name"
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
                                    <label className="auth-label" htmlFor="farmer-email">Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">✉️</span>
                                        <input
                                            id="farmer-email"
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
                                    <label className="auth-label" htmlFor="farmer-password">Password</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">🔒</span>
                                        <input
                                            id="farmer-password"
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
                                    <label className="auth-label" htmlFor="farmer-password-confirm">Confirm Password</label>
                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">🔐</span>
                                        <input
                                            id="farmer-password-confirm"
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
                                    id="register-farmer-submit-btn"
                                    className="auth-btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="auth-spinner" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>🌾 Register as Farmer</>
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
                                    Want to buy?{" "}
                                    <Link to="/register/client" className="auth-link">🛒 Register as Client</Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
