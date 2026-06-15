import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import { fetchOrderById } from "../../../features/orders/orderSlice";
import { selectCurrentOrder, selectOrdersLoading, selectOrdersError } from "../../../features/orders/orderSelectors";
import OrderStatusBadge from "../../../components/orders/OrderStatusBadge";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const order = useSelector(selectCurrentOrder);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    if (loading && !order) {
        return (
            <div className="container py-5 text-center">
                <Spinner animation="border" variant="success" />
                <p className="text-muted mt-2">Loading order details…</p>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="container py-5 text-center">
                <Alert variant="danger">{typeof error === "string" ? error : "Order not found"}</Alert>
                <Link to="/client/orders" className="btn btn-outline-success">← Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>← Back</button>
                <span className="text-muted">/ Order #{order?.id}</span>
            </div>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">
                                Order #{order?.id}
                                <div className="mt-1">
                                    <OrderStatusBadge status={order?.status} />
                                </div>
                            </Card.Title>
                            <div className="d-flex flex-column gap-2">
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Date</small>
                                    <p className="mb-0">{order?.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Delivery Address</small>
                                    <p className="mb-0">{order?.delivery_address || "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Phone</small>
                                    <p className="mb-0">{order?.phone || "—"}</p>
                                </div>
                                <div>
                                    <small className="text-muted text-uppercase fw-semibold">Total</small>
                                    <p className="mb-0 fs-5 fw-bold text-success">
                                        {order?.total ? `${Number(order.total).toFixed(2)} MAD` : "—"}
                                    </p>
                                </div>
                                {order?.notes && (
                                    <div>
                                        <small className="text-muted text-uppercase fw-semibold">Notes</small>
                                        <p className="mb-0">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
                        <Card.Body>
                            <Card.Title className="h5 fw-bold mb-3">Items</Card.Title>
                            <Table striped bordered hover responsive className="align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Product</th>
                                        <th>Pack Qty</th>
                                        <th>Weight</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!order?.items || order.items.length === 0) ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-3">No items.</td>
                                        </tr>
                                    ) : (
                                        order.items.map((item, i) => (
                                            <tr key={item.id || i}>
                                                <td className="fw-medium">{item.product_name || item.product?.name || `Product #${item.product_id}`}</td>
                                                <td>{item.pack_quantity ?? item.quantity ?? "—"}</td>
                                                <td>{item.weight ? `${item.weight} kg` : "—"}</td>
                                                <td>{item.unit_price ? `${Number(item.unit_price).toFixed(2)} MAD/kg` : "—"}</td>
                                                <td className="fw-bold">{item.subtotal ? `${Number(item.subtotal).toFixed(2)} MAD` : "—"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                            {order?.harvest_date && (
                                <Alert variant="info" className="mb-0">
                                    <small>🗓️ Harvest date: {new Date(order.harvest_date).toLocaleDateString()}</small>
                                    {order?.estimated_delivery_date && (
                                        <><br /><small>🚚 Est. delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}</small></>
                                    )}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
