import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";

import { loginUser } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
    selectIsAuthenticated,
} from "../features/auth/authSelectors";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>

                {error ? <p style={{ color: "red" }}>{error}</p> : null}

                <div>
                    <Link to="/register/client">Create Client Account</Link>
                </div>
                <div>
                    <Link to="/register/farmer">Create Farmer Account</Link>
                </div>
            </form>
        </div>
    );
}

