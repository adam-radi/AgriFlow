

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { registerFarmer } from "../features/auth/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
} from "../features/auth/authSelectors";

export default function RegisterFarmerPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const dispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerFarmer(formData));
    };

    return (
        <div>
            <h2>Register Farmer</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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

                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>

                {error ? <p style={{ color: "red" }}>{error}</p> : null}

                <div>
                    <Link to="/login">Already have an account?</Link>
                </div>
            </form>
        </div>
    );
}

