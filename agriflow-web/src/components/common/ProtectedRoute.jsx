import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserRole } from "../../features/auth/authSelectors";

/**
 * ProtectedRoute - wraps a component and:
 * 1. Redirects to /login if not authenticated
 * 2. Redirects to /unauthorized if role not allowed (when allowedRoles is provided)
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectUserRole);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
