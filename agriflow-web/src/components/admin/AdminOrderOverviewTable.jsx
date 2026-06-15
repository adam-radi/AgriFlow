import { Table, Badge, Spinner } from "react-bootstrap";

const STATUS_COLORS = {
    pending: "warning",
    confirmed: "info",
    processing: "primary",
    shipped: "secondary",
    delivered: "success",
    cancelled: "danger",
};

export default function AdminOrderOverviewTable({ orders = [], loading }) {
    if (loading) {
        return <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>;
    }
    return (
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
                        <tr key={order.id}>
                            <td className="fw-medium">#{order.id}</td>
                            <td>{order.customer_name || order.customer?.name || "—"}</td>
                            <td>{order.items_count ?? order.items?.length ?? 0}</td>
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
    );
}
