import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, suspendUser } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminUsers,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminUserTable from "../../components/admin/AdminUserTable";

export default function AdminUsersPage() {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    function handleSuspend(id) {
        dispatch(suspendUser(id));
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Users</h1>
                <p className="text-muted mb-0">Manage all platform users</p>
            </div>
            <AdminUserTable users={users} loading={loading} onSuspend={handleSuspend} />
        </div>
    );
}
