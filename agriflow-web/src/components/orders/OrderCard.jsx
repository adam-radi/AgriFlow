import { Card, Row, Col, Button } from "react-bootstrap";

export default function OrderCard({ order, onView }) {
    return (
        <Card className="shadow-sm border-0" style={{ borderRadius: "10px" }}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <Card.Title className="h6 mb-1 fw-bold">
                            Order #{order.id}
                        </Card.Title>
                        <Card.Subtitle className="text-muted small">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                        </Card.Subtitle>
                    </div>
                    <span className={`badge bg-${order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "warning"} text-capitalize`}>
                        {order.status || "pending"}
                    </span>
                </div>
                <hr className="my-2" />
                <Row className="text-center small">
                    <Col>
                        <div className="text-muted">Items</div>
                        <div className="fw-bold">{order.items_count ?? order.items?.length ?? 0}</div>
                    </Col>
                    <Col>
                        <div className="text-muted">Total</div>
                        <div className="fw-bold text-success">
                            {order.total ? `${Number(order.total).toFixed(2)} MAD` : "—"}
                        </div>
                    </Col>
                </Row>
                {onView && (
                    <Button variant="outline-success" size="sm" className="w-100 mt-3" onClick={() => onView(order.id)}>
                        View Details
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}
