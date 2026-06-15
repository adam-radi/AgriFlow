import { Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const statusVariant = {
    pending: "warning",
    confirmed: "info",
    preparing: "primary",
    harvesting: "secondary",
    ready_for_delivery: "success",
    delivering: "dark",
    delivered: "success",
    cancelled: "danger",
};

export default function OrderTable({ orders = [], role = "client" }) {
    const linkPrefix = role === "admin" ? "/admin/orders" : role === "farmer" ? "/farmer/orders" : "/client/orders";

    return (
        <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
                <tr>
                    <th>Order #</th>
                    {role !== "client" && <th>Customer</th>}
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan={role !== "client" ? 7 : 6} className="text-center text-muted py-4">
                            No orders found.
                        </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order.id}>
                            <td className="fw-medium">#{order.id}</td>
                            {role !== "client" && <td>{order.customer_name || order.customer?.name || "—"}</td>}
                            <td>{order.items_count ?? order.items?.length ?? 0}</td>
                            <td className="fw-bold text-success">
                                {order.total ? `${Number(order.total).toFixed(2)} MAD` : "—"}
                            </td>
                            <td>
                                <Badge bg={statusVariant[order.status] || "light"} className="text-capitalize">
                                    {order.status || "pending"}
                                </Badge>
                            </td>
                            <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}</td>
                            <td>
                                <Link to={`${linkPrefix}/${order.id}`} className="btn btn-outline-success btn-sm">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
