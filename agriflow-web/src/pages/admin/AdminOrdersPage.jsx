import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../app/store/slices/admin/adminSlice";
import {
    selectAdminOrders,
    selectAdminLoading,
} from "../../app/store/slices/admin/adminSelectors";
import { Table, Badge, Spinner } from "react-bootstrap";

const STATUS_COLORS = {
    pending: "warning",
    confirmed: "info",
    cancelled: "danger",
    delivered: "success",
};

export default function AdminOrdersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectAdminOrders);
    const loading = useSelector(selectAdminLoading);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">Orders</h1>
                <p className="text-muted mb-0">View and manage all platform orders</p>
            </div>

            {loading && orders.length === 0 ? (
                <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-3">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td className="fw-medium">#{order.id}</td>
                                    <td>{order.customer?.name || "—"}</td>
                                    <td>{order.items?.length ?? 0}</td>
                                    <td>{order.total_amount ? `${Number(order.total_amount).toFixed(2)} MAD` : "—"}</td>
                                    <td>
                                        <Badge bg={STATUS_COLORS[order.status] || "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
