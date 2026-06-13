


import { useDispatch, useSelector } from "react-redux"
import { selectUser, selectIsAuthenticated, selectUserRole } from "../features/auth/authSelectors";

import {logout} from "../features/auth/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuthenticated);
    const role = useSelector(selectUserRole);

    const handleLogout = () => {
        dispatch(logout())
    }
    
    
    return {
        user , 
        isAuth,
        role,
        logout:handleLogout,
    };


};