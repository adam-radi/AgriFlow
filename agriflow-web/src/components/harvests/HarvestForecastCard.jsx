import { Card, Row, Col, ProgressBar } from "react-bootstrap";

export default function HarvestForecastCard({ forecast = {} }) {
    const usagePct = forecast.capacity_usage_pct ?? (
        forecast.estimated_quantity > 0
            ? ((forecast.reserved_quantity / forecast.estimated_quantity) * 100).toFixed(1)
            : 0
    );

    return (
        <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <Card.Body>
                <Card.Title className="h6 fw-bold mb-3">Demand Forecast</Card.Title>
                <Row className="g-3">
                    <Col xs={6}>
                        <div className="p-3 bg-light rounded-3 text-center">
                            <div className="text-muted small">Total Demand</div>
                            <div className="fs-5 fw-bold text-success">{forecast.total_demand ?? "—"}</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="p-3 bg-light rounded-3 text-center">
                            <div className="text-muted small">Orders</div>
                            <div className="fs-5 fw-bold text-primary">{forecast.orders_count ?? "—"}</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="p-3 bg-light rounded-3 text-center">
                            <div className="text-muted small">Reserved</div>
                            <div className="fs-5 fw-bold text-warning">{forecast.reserved_quantity ?? "—"}</div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="p-3 bg-light rounded-3 text-center">
                            <div className="text-muted small">Remaining</div>
                            <div className="fs-5 fw-bold text-info">{forecast.remaining_quantity ?? "—"}</div>
                        </div>
                    </Col>
                </Row>
                <div className="mt-3">
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Capacity Usage</span>
                        <span className="fw-bold">{usagePct}%</span>
                    </div>
                    <ProgressBar
                        now={Math.min(usagePct, 100)}
                        variant={usagePct > 80 ? "danger" : usagePct > 50 ? "warning" : "success"}
                        style={{ height: "10px", borderRadius: "6px" }}
                    />
                </div>
            </Card.Body>
        </Card>
    );
}
