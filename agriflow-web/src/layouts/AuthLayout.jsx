import { Outlet } from "react-router-dom";

/**
 * AuthLayout — Layout minimal pour les pages d'authentification (Phase 05)
 * Les pages auth gèrent leur propre header avec le Logo + indicateur pays.
 * Ce layout ne doit pas inclure la Navbar flottante publique.
 */
function AuthLayout() {
    return (
        <div style={{ backgroundColor: "var(--af-canvas, #F6F8F5)", minHeight: "100vh" }}>
            <Outlet />
        </div>
    );
}

export default AuthLayout;
