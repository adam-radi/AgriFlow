import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../../app/store/slices/admin/adminSlice";
import { selectAdminOrders } from "../../app/store/slices/admin/adminSelectors";
import { Card, Badge, Button, Table, Row, Col, Spinner, Alert } from "react-bootstrap";

const STATUS_COLORS = {
    pending: "warning",
    confirmed: "info",
    cancelled: "danger",
    delivered: "success",
};

const NEXT_STATUS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

export default function AdminOrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orders = useSelector(selectAdminOrders);
    const [updating, setUpdating] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (orders.length === 0) dispatch(fetchOrders());
    }, [dispatch, orders.length]);

    const order = orders.find((o) => String(o.id) === String(id));

    function handleStatus(status) {
        setUpdating(true);
        dispatch(updateOrderStatus({ id: order.id, status })).then((res) => {
            setUpdating(false);
            if (res.meta?.rejectedWithValue) {
                setMsg({ type: "danger", text: "Failed to update status" });
            } else {
                setMsg({ type: "success", text: `Order ${status}` });
            }
        });
    }

    if (!order && orders.length > 0) {
        return (
            <div className="p-4">
                <Alert variant="warning">Order #{id} not found.</Alert>
                <Button variant="secondary" onClick={() => navigate("/admin/orders")}>Back to Orders</Button>
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;
    }

    const allowed = NEXT_STATUS[order.status] || [];

    return (
        <div className="p-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold mb-1">Order #{order.id}</h1>
                    <p className="text-muted mb-0">
                        <Badge bg={STATUS_COLORS[order.status] || "secondary"} className="me-2">{order.status}</Badge>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                    </p>
                </div>
                <Button variant="secondary" onClick={() => navigate("/admin/orders")}>← Back</Button>
            </div>

            {msg && <Alert variant={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</Alert>}

            <Row className="g-4">
                <Col md={8}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Card.Body>
                            <Card.Title className="h6 fw-bold mb-3">Items</Card.Title>
                            {order.items?.length > 0 ? (
                                <Table striped bordered hover size="sm" className="align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.product?.name || `Product #${item.product_id}`}</td>
                                                <td>{item.quantity}</td>
                                                <td>{Number(item.unit_price).toFixed(2)} MAD</td>
                                                <td>{Number(item.quantity * item.unit_price).toFixed(2)} MAD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted mb-0">No items</p>
                            )}
                            <div className="text-end mt-3 fw-bold" style={{ fontSize: "1.1rem" }}>
                                Total: {Number(order.total_amount).toFixed(2)} MAD
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: 12 }}>
                        <Card.Body>
                            <Card.Title className="h6 fw-bold mb-3">Customer</Card.Title>
                            <p className="mb-1"><strong>{order.customer?.name || "—"}</strong></p>
                            <p className="mb-1 text-muted" style={{ fontSize: ".85rem" }}>{order.customer?.email || ""}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: ".85rem" }}>{order.customer?.phone || ""}</p>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0 mb-3" style={{ borderRadius: 12 }}>
                        <Card.Body>
                            <Card.Title className="h6 fw-bold mb-3">Payment</Card.Title>
                            {order.payment ? (
                                <div>
                                    <Badge bg={order.payment.status === "paid" ? "success" : order.payment.status === "pending" ? "warning" : "danger"}>
                                        {order.payment.status}
                                    </Badge>
                                    <p className="mt-2 mb-0 text-muted" style={{ fontSize: ".85rem" }}>
                                        {Number(order.payment.amount).toFixed(2)} MAD
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">No payment</p>
                            )}
                        </Card.Body>
                    </Card>

                    {allowed.length > 0 && (
                        <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                            <Card.Body>
                                <Card.Title className="h6 fw-bold mb-3">Actions</Card.Title>
                                <div className="d-flex gap-2 flex-wrap">
                                    {allowed.includes("confirmed") && (
                                        <Button variant="info" disabled={updating} onClick={() => handleStatus("confirmed")}>Confirm</Button>
                                    )}
                                    {allowed.includes("delivered") && (
                                        <Button variant="success" disabled={updating} onClick={() => handleStatus("delivered")}>Mark Delivered</Button>
                                    )}
                                    {allowed.includes("cancelled") && (
                                        <Button variant="danger" disabled={updating} onClick={() => handleStatus("cancelled")}>Cancel</Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
}
