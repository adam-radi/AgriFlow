import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { fetchOrders } from "../../../features/orders/orderSlice";
import { selectOrders, selectOrdersLoading, selectOrdersError } from "../../../features/orders/orderSelectors";
import OrderCard from "../../../components/orders/OrderCard";

export default function OrdersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectOrders);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Orders</h1>
                <p className="text-muted mb-0">Track your order history</p>
            </div>

            {error && <Alert variant="danger">{typeof error === "string" ? error : "Failed to load orders"}</Alert>}

            {loading && orders.length === 0 && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="text-muted mt-2">Loading orders…</p>
                </div>
            )}

            {!loading && orders.length === 0 && !error && (
                <div className="text-center py-5">
                    <div style={{ fontSize: "3rem" }}>📦</div>
                    <h5 className="mt-3">No orders yet</h5>
                    <p className="text-muted">Start by browsing products.</p>
                </div>
            )}

            {orders.length > 0 && (
                <Row className="g-4">
                    {orders.map((order) => (
                        <Col key={order.id} sm={6} lg={4}>
                            <OrderCard order={order} onView={(id) => navigate(`/client/orders/${id}`)} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
