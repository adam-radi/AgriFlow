import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const statusVariant = {
    planned: "warning",
    active: "success",
    completed: "secondary",
    cancelled: "danger",
};

export default function HarvestCard({ harvest, linkPrefix = "/farmer/harvests" }) {
    const variant = statusVariant[harvest.status] || "light";

    return (
        <Card className="h-100 shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h6 mb-0 fw-bold">{harvest.name || `Harvest #${harvest.id}`}</Card.Title>
                    <Badge bg={variant} className="text-capitalize">{harvest.status || "planned"}</Badge>
                </div>
                <Card.Subtitle className="text-muted small mb-3">
                    {harvest.product_name || harvest.product?.name || "—"}
                </Card.Subtitle>
                <div className="mt-auto small text-muted">
                    <div className="d-flex justify-content-between mb-1">
                        <span>Start:</span>
                        <span className="fw-medium">{harvest.start_date ? new Date(harvest.start_date).toLocaleDateString() : "—"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>End:</span>
                        <span className="fw-medium">{harvest.end_date ? new Date(harvest.end_date).toLocaleDateString() : "—"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>Est. Qty:</span>
                        <span className="fw-medium">{harvest.estimated_quantity ?? "—"}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Daily Limit:</span>
                        <span className="fw-medium">{harvest.max_quantity_per_day ?? "—"}</span>
                    </div>
                </div>
                <Link to={`${linkPrefix}/${harvest.id}`} className="btn btn-outline-success btn-sm mt-3 w-100">
                    View Details
                </Link>
            </Card.Body>
        </Card>
    );
}
