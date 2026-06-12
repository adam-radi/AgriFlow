import {Navigate} from "react-router-dom";
import { useSelector } from "react-redux";
import {selectISSuthenticated} from "../../features/auth/authSelectors";

function ProtectedRoute({ children }){
    const isAuthenticated = useSelector(
        selectIsAuthenticated
    );
    if (!isAuthenticated){
        return <Navigate to="/" replace />;
    }

    return children
}
export default ProtectedRoute;