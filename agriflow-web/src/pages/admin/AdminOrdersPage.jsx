import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminOrders,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import AdminOrderOverviewTable from "../../components/admin/AdminOrderOverviewTable";

export default function AdminOrdersPage() {
    const dispatch = useDispatch();
    const orders = useSelector(selectAdminOrders);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Orders</h1>
                <p className="text-muted mb-0">View all platform orders</p>
            </div>
            <AdminOrderOverviewTable orders={orders} loading={loading} />
        </div>
    );
}
