import { useSelector } from "react-redux";
import { selectUserRole } from "../../features/auth/authSelectors";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ children, allowedRoles = [] }) {

    const role =useSelector(selectUserRole);

    if (!role) {
        return (<Navigate to="/login" replace/>) 
    }
    if (! allowedRoles.includes(role)){
        return <Navigate to="/unauthorized" replace />
    }
    return children;
}